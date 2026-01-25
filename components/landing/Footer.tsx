import React from 'react';
import { Mail, Phone, MapPin, Github, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "Video Lectures", href: "/select" },
        { name: "Notes & Materials", href: "/select" },
        { name: "Practicals & Lab Manual", href: "/select" },
        { name: "Previous Year Questions", href: "/select" },
        { name: "Important Questions", href: "/select" },
      ]
    },
    {
      title: "Engineering Subjects",
      links: [
        { name: "Computer Engineering", href: "/select" },
        { name: "Electrical Engineering", href: "/select" },
        { name: "Mechanical Engineering", href: "/select" },
        { name: "Civil Engineering", href: "/select" },
        { name: "Electronics & Telecom", href: "/select" },
      ]
    },
    {
      title: "Popular Subjects",
      links: [
        { name: "Operating System", href: "/select" },
        { name: "Database Management", href: "/select" },
        { name: "Computer Networks", href: "/select" },
        { name: "Data Structures", href: "/select" },
        { name: "Software Engineering", href: "/select" },
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "#" },
        { name: "Contact Us", href: "#" },
        { name: "Student Forum", href: "#" },
        { name: "Technical Support", href: "#" },
        { name: "Feedback", href: "/feedback" },
      ]
    }
  ];

  const socialLinks = [
    { icon: Twitter, href: "https://x.com/karan_052", label: "Twitter" },
    { icon: Instagram, href: "https://www.instagram.com/faiz_moulavi11/", label: "Instagram" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/kstubhie/", label: "LinkedIn" },
    { icon: Github, href: "https://github.com/kstubhie", label: "GitHub" },
  ];

  return (
    <footer className="bg-white dark:bg-[oklch(0.205_0_0)] border-t border-gray-200 dark:border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Ziora
                </h3>
                <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  Empowering students with comprehensive study materials, expert guidance, and cutting-edge technology. 
                  Learn smart, learn fast, learn everything with Ziora.
                </p>
              </div>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Mail className="h-4 w-4 mr-3 text-gray-400" />
                  ziora.education@gmail.com
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Phone className="h-4 w-4 mr-3 text-gray-400" />
                  +91 9136261589
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                  Mumbai, Maharashtra, India
                </div>
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section) => (
              <div key={section.title} className="lg:col-span-1">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-200 dark:border-black py-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:flex-1">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Stay Updated
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 md:mb-0">
                Get the latest study tips, exam updates, and educational resources delivered to your inbox.
              </p>
            </div>
            <div className="md:ml-8 md:flex-shrink-0">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 text-sm border border-gray-300 dark:border-black rounded-l-lg bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
                />
                <button className="px-6 py-2 text-sm font-medium text-white bg-black dark:bg-white dark:text-black rounded-r-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-200">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 dark:border-black py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
            <div className="mt-4 md:mt-0 md:order-1">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  © {currentYear} Ziora. All rights reserved.
                </p>
                <div className="flex space-x-6">
                  <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                  <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    Terms of Service
                  </a>
                  <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
