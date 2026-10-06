import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, LogOut, User as UserIcon } from 'lucide-react';

export const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              TaskFlow
            </h1>
            <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-widest block -mt-1">
              Full-Stack Edition
            </span>
          </div>
        </div>

        {/* User Info & Logout Button */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
              <UserIcon className="w-3.5 h-3.5 text-slate-400" />
              <span className="max-w-[180px] truncate">{user.email}</span>
            </div>

            <button
              onClick={signOut}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 active:bg-red-100 border border-red-200/80 rounded-lg transition-all duration-150 cursor-pointer shadow-xs"
              title="Log out of your account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
