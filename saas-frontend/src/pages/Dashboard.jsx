import React from 'react';
import { Users, MessageSquare, Activity, ArrowUpRight } from 'lucide-react';
import { Card } from '../components/UI';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const stats = [
    { title: 'Total Users', value: '12,345', icon: <Users size={24} />, trend: '+12%' },
    { title: 'Messages Sent', value: '842,104', icon: <MessageSquare size={24} />, trend: '+24%' },
    { title: 'Active Sessions', value: '1,234', icon: <Activity size={24} />, trend: '+5%' },
  ];

  const recentActivity = [
    { user: 'Alice Smith', action: 'joined the team', time: '2 mins ago' },
    { user: 'Bob Jones', action: 'created a new channel', time: '1 hour ago' },
    { user: 'Charlie Brown', action: 'uploaded a file', time: '3 hours ago' },
    { user: 'Diana Prince', action: 'invited 3 members', time: '5 hours ago' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-text">Dashboard Overview</h1>
          <p className="text-text-muted mt-1">Welcome back, John Doe.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-primary/10 text-primary rounded-lg">
                  {stat.icon}
                </div>
                <span className="flex items-center text-sm font-medium text-green-500 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-full">
                  {stat.trend} <ArrowUpRight size={14} className="ml-1" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-bold text-text">{stat.value}</h3>
                <p className="text-sm text-text-muted mt-1">{stat.title}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <h2 className="text-lg font-bold text-text mb-6">Recent Activity</h2>
          <div className="space-y-6">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-text font-medium">
                  {activity.user.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-text">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
