import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("ziora");

    // Get user statistics
    const usersCollection = db.collection("users");
    const users = await usersCollection.find({}).toArray();

    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.status !== 'suspended' && user.status !== 'deleted').length;
    const suspendedUsers = users.filter(user => user.status === 'suspended').length;
    
    // Calculate new users this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const newUsersThisWeek = users.filter(user => 
      user.createdAt && new Date(user.createdAt) > oneWeekAgo
    ).length;

    // Get comment statistics from academic_content collection
    const academicCollection = db.collection("academic_content");
    const documents = await academicCollection.find({}).toArray();

    let allComments: any[] = [];

    // Extract all comments from the nested structure
    for (const doc of documents) {
      for (const [yearKey, yearData] of Object.entries(doc)) {
        if (['SE', 'TE', 'FE', 'BE'].includes(yearKey) && typeof yearData === 'object') {
          const year = yearData as any;
          
          for (const [semesterKey, semesterData] of Object.entries(year)) {
            if (semesterKey.startsWith('sem-') && typeof semesterData === 'object') {
              const semester = semesterData as any;
              
              for (const [branchKey, branchData] of Object.entries(semester)) {
                if (typeof branchData === 'object') {
                  const branch = branchData as any;
                  
                  for (const [subjectKey, subjectData] of Object.entries(branch)) {
                    if (typeof subjectData === 'object') {
                      const subject = subjectData as any;
                      
                      // Process notes comments
                      if (subject.notes?.modules) {
                        for (const module of subject.notes.modules) {
                          if (module.comments) {
                            for (const comment of module.comments) {
                              allComments.push({
                                ...comment,
                                type: 'notes'
                              });
                              
                              // Process nested replies
                              if (comment.replies) {
                                const flattenReplies = (replies: any[]) => {
                                  for (const reply of replies) {
                                    allComments.push({
                                      ...reply,
                                      type: 'notes'
                                    });
                                    if (reply.replies) {
                                      flattenReplies(reply.replies);
                                    }
                                  }
                                };
                                flattenReplies(comment.replies);
                              }
                            }
                          }
                        }
                      }
                      
                      // Process video-lectures comments
                      if (subject['video-lecs']?.modules) {
                        for (const module of subject['video-lecs'].modules) {
                          if (module.topics) {
                            for (const topic of module.topics) {
                              if (topic.comments) {
                                for (const comment of topic.comments) {
                                  allComments.push({
                                    ...comment,
                                    type: 'videos'
                                  });
                                  
                                  // Process nested replies
                                  if (comment.replies) {
                                    const flattenReplies = (replies: any[]) => {
                                      for (const reply of replies) {
                                        allComments.push({
                                          ...reply,
                                          type: 'videos'
                                        });
                                        if (reply.replies) {
                                          flattenReplies(reply.replies);
                                        }
                                      }
                                    };
                                    flattenReplies(comment.replies);
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    // Calculate comment statistics
    const totalComments = allComments.length;
    const pendingComments = allComments.filter(comment => comment.status === 'pending' || !comment.status).length;
    const flaggedComments = allComments.filter(comment => comment.status === 'flagged').length;
    
    // Calculate comments today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const commentsToday = allComments.filter(comment => {
      if (!comment.timestamp) return false;
      
      let commentDate: Date;
      if (typeof comment.timestamp === 'string') {
        // Handle custom timestamp formats like "22/06/2025, 00:46:48"
        if (comment.timestamp.includes(',')) {
          const [datePart, timePart] = comment.timestamp.split(', ');
          const [day, month, year] = datePart.split('/');
          commentDate = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${timePart}`);
        } else {
          commentDate = new Date(comment.timestamp);
        }
      } else {
        commentDate = new Date(comment.timestamp);
      }
      
      return commentDate >= today;
    }).length;

    // Get security statistics
    const securityCollection = db.collection("security_events");
    const securityEvents = await securityCollection.find({}).toArray();

    const totalSecurityEvents = securityEvents.length;
    const screenshotAttempts = securityEvents.filter(event => event.eventType === 'screenshot_attempt').length;
    const rightClicks = securityEvents.filter(event => event.eventType === 'right_click').length;
    const devToolsAttempts = securityEvents.filter(event => event.eventType === 'dev_tools_open').length;
    
    // Calculate security events today
    const todaySecurityEvents = securityEvents.filter(event => {
      if (!event.timestamp) return false;
      const eventDate = new Date(event.timestamp);
      return eventDate >= today;
    }).length;

    // Get reviews/feedback statistics
    const feedbackCollection = db.collection("feedback");
    const allFeedback = await feedbackCollection.find({}).toArray();

    const totalReviews = allFeedback.length;
    const pendingReviews = allFeedback.filter(review => review.status === 'pending').length;
    
    // Calculate average rating
    let averageRating = 0;
    if (allFeedback.length > 0) {
      const totalRating = allFeedback.reduce((sum, review) => sum + (review.rating || 0), 0);
      averageRating = totalRating / allFeedback.length;
    }
    
    // Calculate reviews this week
    const reviewsThisWeek = allFeedback.filter(review => 
      review.createdAt && new Date(review.createdAt) > oneWeekAgo
    ).length;

    return NextResponse.json({
      success: true,
      statistics: {
        users: {
          total: totalUsers,
          active: activeUsers,
          suspended: suspendedUsers,
          newThisWeek: newUsersThisWeek
        },
        comments: {
          total: totalComments,
          pending: pendingComments,
          flagged: flaggedComments,
          today: commentsToday
        },
        reviews: {
          total: totalReviews,
          pending: pendingReviews,
          averageRating: averageRating,
          thisWeek: reviewsThisWeek
        },
        security: {
          totalEvents: totalSecurityEvents,
          screenshotAttempts: screenshotAttempts,
          rightClicks: rightClicks,
          devToolsAttempts: devToolsAttempts,
          todayEvents: todaySecurityEvents
        }
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard statistics:', error);
    return NextResponse.json(
      { success: false, error: 'Error fetching dashboard statistics' },
      { status: 500 }
    );
  }
} 