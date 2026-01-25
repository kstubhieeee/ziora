import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rating, feedback } = body;

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Valid rating (1-5) is required' },
        { status: 400 }
      );
    }

    if (!feedback || !feedback.trim()) {
      return NextResponse.json(
        { success: false, error: 'Feedback text is required' },
        { status: 400 }
      );
    }

    // Get user information from cookies if available
    let userInfo = null;
    const userCookie = request.cookies.get('user');
    if (userCookie) {
      try {
        userInfo = JSON.parse(userCookie.value);
      } catch (e) {
        // If parsing fails, continue without user info
      }
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('ziora');
    const feedbackCollection = db.collection('feedback');

    // Create feedback document
    const feedbackDoc = {
      rating,
      feedback: feedback.trim(),
      userId: userInfo?.id || null,
      userName: userInfo?.name || 'Anonymous',
      userEmail: userInfo?.email || null,
      createdAt: new Date(),
      status: 'pending', // pending, reviewed, archived
    };

    // Insert feedback into database
    const result = await feedbackCollection.insertOne(feedbackDoc);

    if (result.acknowledged) {
      return NextResponse.json({
        success: true,
        message: 'Feedback submitted successfully',
        feedbackId: result.insertedId,
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to save feedback' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Feedback submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // This endpoint is for admin use only
    // Verify admin authentication
    const userCookie = request.cookies.get('user');
    if (!userCookie) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let userData;
    try {
      userData = JSON.parse(userCookie.value);
    } catch (e) {
      return NextResponse.json(
        { success: false, error: 'Invalid session' },
        { status: 401 }
      );
    }

    if (!userData.isAdmin && userData.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('ziora');
    const feedbackCollection = db.collection('feedback');

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = parseInt(searchParams.get('skip') || '0');

    // Build query
    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    // Fetch feedback with pagination
    const feedback = await feedbackCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get total count
    const totalCount = await feedbackCollection.countDocuments(query);

    // Get statistics
    const stats = {
      total: await feedbackCollection.countDocuments(),
      pending: await feedbackCollection.countDocuments({ status: 'pending' }),
      reviewed: await feedbackCollection.countDocuments({ status: 'reviewed' }),
      averageRating: 0,
      ratingDistribution: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      },
    };

    // Calculate average rating and distribution
    const allFeedback = await feedbackCollection.find().toArray();
    if (allFeedback.length > 0) {
      const totalRating = allFeedback.reduce((sum, item) => sum + item.rating, 0);
      stats.averageRating = totalRating / allFeedback.length;

      allFeedback.forEach((item) => {
        if (item.rating >= 1 && item.rating <= 5) {
          stats.ratingDistribution[item.rating as keyof typeof stats.ratingDistribution]++;
        }
      });
    }

    return NextResponse.json({
      success: true,
      feedback,
      totalCount,
      stats,
    });
  } catch (error) {
    console.error('Feedback fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
