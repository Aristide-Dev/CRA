import React, { useState } from 'react';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Calendar, List, Grid, BarChart3, Plus, Edit2, Trash2, 
  X, Check, Code, Users, Search, GraduationCap
} from 'lucide-react';
import ModernActivityForm from '../../Pages/CRA/Partials/ModernActivityForm';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg max-w-4xl w-full m-4 max-h-[90vh] overflow-y-auto">
        <div className="p-2 text-right">
          <button 
            onClick={onClose}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const AddActivityButton = ({ onAdd, view }) => {
  let buttonClass = '';
  
  switch (view) {
    case 'calendar':
      buttonClass = 'fixed bottom-6 right-6';
      break;
    case 'list':
      buttonClass = 'mb-4';
      break;
    case 'grid':
      buttonClass = 'col-span-full mb-4';
      break;
    case 'timeline':
      buttonClass = 'mb-4';
      break;
    default:
      buttonClass = 'mb-4';
  }

  return (
    <button
      onClick={onAdd}
      className={`${buttonClass} bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 
        transition-colors flex items-center shadow-lg`}
    >
      <Plus className="w-5 h-5 mr-2" />
      Nouvelle activité
    </button>
  );
};

const CalendarView = ({ activities, monthYear, onEdit, onAdd }) => {
  const startDate = startOfMonth(parseISO(monthYear));
  const endDate = endOfMonth(parseISO(monthYear));
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const handleDayClick = (date) => {
    onAdd(date);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="grid grid-cols-7 gap-2">
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
          <div key={day} className="text-center font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
        {days.map(day => {
          const dayActivities = activities.filter(activity => 
            isSameDay(parseISO(activity.date), day)
          );
          
          return (
            <div
              key={day.toString()}
              onClick={() => handleDayClick(day)}
              className={`min-h-32 border rounded-lg p-2 cursor-pointer 
                hover:border-indigo-300 transition-colors ${
                dayActivities.length > 0 ? 'bg-indigo-50' : 'bg-gray-50'
              }`}
            >
              <div className="font-medium text-gray-700">
                {format(day, 'd')}
              </div>
              <div className="mt-1 space-y-1">
                {dayActivities.map(activity => (
                  <div
                    key={activity.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(activity);
                    }}
                    className="text-xs p-1 rounded bg-indigo-100 text-indigo-700 
                      hover:bg-indigo-200 cursor-pointer"
                  >
                    {activity.project_name} - {activity.duration}h
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ListView = ({ activities, onEdit }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="flow-root">
        <ul className="divide-y divide-gray-200">
          {activities.map(activity => (
            <li 
              key={activity.id} 
              className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => onEdit(activity)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {activity.type === 'development' && <Code className="w-5 h-5 text-blue-500" />}
                    {activity.type === 'meeting' && <Users className="w-5 h-5 text-green-500" />}
                    {activity.type === 'research' && <Search className="w-5 h-5 text-purple-500" />}
                    {activity.type === 'training' && <GraduationCap className="w-5 h-5 text-orange-500" />}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.project_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(parseISO(activity.date), 'dd MMMM yyyy', { locale: fr })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {activity.duration}h
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(activity);
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const GridView = ({ activities, onEdit }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {activities.map(activity => (
        <div 
          key={activity.id}
          className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl 
            transition-shadow cursor-pointer"
          onClick={() => onEdit(activity)}
        >
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {activity.project_name}
              </h3>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                {activity.duration}h
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {format(parseISO(activity.date), 'dd MMMM yyyy', { locale: fr })}
            </p>
            {activity.remarks && (
              <p className="mt-2 text-sm text-gray-600">
                {activity.remarks}
              </p>
            )}
          </div>
          <div className="border-t bg-gray-50 px-4 py-3 flex justify-between items-center">
            <span className="text-sm text-gray-600 capitalize">
              {activity.type}
            </span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(activity);
              }}
              className="text-gray-400 hover:text-gray-500"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const TimelineView = ({ activities, onEdit }) => {
  const groupedActivities = activities.reduce((acc, activity) => {
    const date = format(parseISO(activity.date), 'yyyy-MM-dd');
    if (!acc[date]) acc[date] = [];
    acc[date].push(activity);
    return acc;
  }, {});

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
      <div className="space-y-8">
        {Object.entries(groupedActivities).map(([date, dayActivities]) => (
          <div key={date} className="relative">
            <div className="flex items-center">
              <div className="absolute left-4 -translate-x-1/2">
                <div className="h-4 w-4 rounded-full bg-indigo-600" />
              </div>
              <div className="ml-8 bg-white rounded-lg shadow-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">
                  {format(parseISO(date), 'dd MMMM yyyy', { locale: fr })}
                </h3>
                <div className="space-y-3">
                  {dayActivities.map(activity => (
                    <div 
                      key={activity.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-gray-50 
                        hover:bg-gray-100 cursor-pointer"
                      onClick={() => onEdit(activity)}
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {activity.project_name}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">
                          {activity.type}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                        {activity.duration}h
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ActivityViews({ activities, monthYear, projects, craId }) {
  const [currentView, setCurrentView] = useState('calendar');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleAdd = (date = null) => {
    setSelectedActivity(null);
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleEdit = (activity) => {
    setSelectedActivity(activity);
    setSelectedDate(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedActivity(null);
    setSelectedDate(null);
  };

  const renderView = () => {
    const viewProps = {
      activities,
      monthYear,
      onEdit: handleEdit,
      onAdd: handleAdd,
    };

    switch (currentView) {
      case 'calendar':
        return <CalendarView {...viewProps} />;
      case 'list':
        return <ListView {...viewProps} />;
      case 'grid':
        return <GridView {...viewProps} />;
      case 'timeline':
        return <TimelineView {...viewProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <ViewSelector currentView={currentView} onViewChange={setCurrentView} />
        <AddActivityButton onAdd={() => handleAdd()} view={currentView} />
      </div>
      
      {renderView()}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModernActivityForm
          activity={selectedActivity || { 
            date: selectedDate,
            project_id: '',
            type: '',
            duration: '',
            remarks: ''
          }}
          projects={projects}
          monthYear={monthYear}
          craId={craId}
          onSuccess={handleCloseModal}
        />
      </Modal>
    </div>
  );
}