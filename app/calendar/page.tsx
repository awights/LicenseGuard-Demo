'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import StatusBadge from '@/components/StatusBadge';
import { getCurrentUser } from '@/lib/auth';
import { getLicenses, getDaysUntilExpiry, formatDate, sendRenewalNotification } from '@/lib/storage';
import { License } from '@/lib/types';

interface CalendarEvent {
  date: Date;
  licenses: License[];
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [upcomingRenewals, setUpcomingRenewals] = useState<License[]>([]);

  useEffect(() => {
    loadCalendarData();
  }, [currentDate]);

  const loadCalendarData = () => {
    const user = getCurrentUser();
    if (!user) return;

    const allLicenses = getLicenses();
    const userLicenses = user.role === 'admin'
      ? allLicenses
      : allLicenses.filter(l => l.userId === user.id);

    // Group licenses by expiry date
    const events: CalendarEvent[] = [];
    userLicenses.forEach((license) => {
      const expiryDate = new Date(license.expiryDate);
      const existingEvent = events.find(
        (e) => e.date.toDateString() === expiryDate.toDateString()
      );

      if (existingEvent) {
        existingEvent.licenses.push(license);
      } else {
        events.push({ date: expiryDate, licenses: [license] });
      }
    });

    setCalendarEvents(events);

    // Get upcoming renewals (next 6 months)
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

    const upcoming = userLicenses
      .filter((l) => {
        const expiry = new Date(l.expiryDate);
        return expiry >= new Date() && expiry <= sixMonthsFromNow;
      })
      .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

    setUpcomingRenewals(upcoming);
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getEventsForDate = (day: number): License[] => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const event = calendarEvents.find(
      (e) => e.date.toDateString() === date.toDateString()
    );
    return event?.licenses || [];
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(date);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const events = getEventsForDate(day);
      const isToday =
        day === new Date().getDate() &&
        currentDate.getMonth() === new Date().getMonth() &&
        currentDate.getFullYear() === new Date().getFullYear();

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={`h-24 border border-gray-200 p-2 cursor-pointer hover:bg-blue-50 transition-colors ${
            isToday ? 'bg-blue-100 border-blue-400' : 'bg-white'
          }`}
        >
          <div className={`text-sm font-medium ${isToday ? 'text-blue-700' : 'text-gray-900'}`}>
            {day}
          </div>
          {events.length > 0 && (
            <div className="mt-1 space-y-1">
              {events.slice(0, 2).map((license) => (
                <div
                  key={license.id}
                  className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded truncate"
                  title={license.type}
                >
                  {license.type}
                </div>
              ))}
              {events.length > 2 && (
                <div className="text-xs text-gray-600">+{events.length - 2} more</div>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const selectedDateEvents = selectedDate
    ? calendarEvents.find((e) => e.date.toDateString() === selectedDate.toDateString())
        ?.licenses || []
    : [];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Renewal Calendar</h1>
          <p className="text-gray-600 mt-2">View all upcoming license renewal dates</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={previousMonth}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                >
                  ← Previous
                </button>
                <h2 className="text-xl font-semibold text-gray-900">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <button
                  onClick={nextMonth}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                >
                  Next →
                </button>
              </div>

              {/* Day names */}
              <div className="grid grid-cols-7 gap-0 mb-2">
                {dayNames.map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium text-gray-600 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-0 border-t border-l border-gray-200">
                {renderCalendar()}
              </div>

              {/* Legend */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-100 border border-blue-400 rounded mr-2" />
                    <span className="text-gray-700">Today</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-100 rounded mr-2" />
                    <span className="text-gray-700">Renewal Due</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Date Details */}
            {selectedDate && selectedDateEvents.length > 0 && (
              <div className="mt-6 bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {formatDate(selectedDate.toISOString())}
                </h3>
                <div className="space-y-4">
                  {selectedDateEvents.map((license) => (
                    <div
                      key={license.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{license.type}</h4>
                          <p className="text-sm text-gray-600">{license.licenseNumber}</p>
                        </div>
                        <StatusBadge
                          status={license.status}
                          daysUntilExpiry={getDaysUntilExpiry(license.expiryDate)}
                        />
                      </div>
                      <div className="text-sm text-gray-600">
                        State: {license.state}
                      </div>
                      {license.renewalLink && (
                        <a
                          href={license.renewalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block"
                        >
                          Renew Now →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Upcoming Renewals Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Upcoming Renewals
              </h3>

              {upcomingRenewals.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">✓</div>
                  <p className="text-sm">No renewals in the next 6 months</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingRenewals.map((license) => {
                    const daysUntilExpiry = getDaysUntilExpiry(license.expiryDate);
                    const isUrgent = daysUntilExpiry <= 30;

                    return (
                      <div
                        key={license.id}
                        className={`border-l-4 rounded-r-lg p-4 ${
                          isUrgent
                            ? 'border-red-400 bg-red-50'
                            : 'border-yellow-400 bg-yellow-50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {license.type}
                          </h4>
                          <span
                            className={`text-xs font-medium ${
                              isUrgent ? 'text-red-700' : 'text-yellow-700'
                            }`}
                          >
                            {daysUntilExpiry}d
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">
                          {formatDate(license.expiryDate)}
                        </p>
                        {license.renewalLink && (
                          <a
                            href={license.renewalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Renew →
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Email Notifications Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  📧 Email Alerts
                </h4>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>90 days before expiry</span>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>60 days before expiry</span>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>30 days before expiry</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    upcomingRenewals.slice(0, 3).forEach((license) => {
                      const days = getDaysUntilExpiry(license.expiryDate);
                      sendRenewalNotification(license, days);
                    });
                    alert('Mock email notifications sent! Check browser console.');
                  }}
                  className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Test Notifications
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
