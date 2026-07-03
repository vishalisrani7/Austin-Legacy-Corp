import React, { useState } from 'react';
import { 
  Home, Folders, Users, DollarSign, PenTool, 
  CheckSquare, FileText, Search, Bell, Building2, Download
} from 'lucide-react';

const NewDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('Invoice 1');
  const toolsData = [
    { id: 1, desc: 'Lorem ipsum id ac sed viverra', qty: 4, amount: '₹ 5000' },
    { id: 2, desc: 'Lorem ipsum id ac sed viverra', qty: 4, amount: '₹ 10,000' },
  ];

  const roomsData = [
    { id: 1, desc: 'Lorem ipsum id ac sed viverra', qty: 4, amount: '₹ 5000' },
    { id: 2, desc: 'Lorem ipsum id ac sed viverra', qty: 4, amount: '₹ 10,000' },
  ];

  const menuItems = [
    { icon: Home, label: 'Home', active: true },
    { icon: Folders, label: 'Project' },
    { icon: Users, label: 'Employees' },
    { icon: DollarSign, label: 'Finance' },
    { icon: PenTool, label: 'Tools' },
    { icon: CheckSquare, label: 'Approvals' },
    { icon: FileText, label: 'Report' },
  ];

  // The core glass effect class used across the cards
  const glassEffect = "bg-[#1B2028]/20 backdrop-blur-lg border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]";

  return (
    <div 
      className="min-h-screen bg-black text-white flex"
      // Assuming frame1.png is in your public folder. Adjust path as needed.
      style={{ backgroundImage: "url('/frame1.png')", backgroundSize: 'cover', backgroundPosition: 'top left' }}
    >
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-black/40 backdrop-blur-md flex flex-col py-8 px-4">
        <div className="text-2xl font-bold mb-12 px-4 tracking-wider">
          {/* Logo placeholder */}
        </div>
        <nav className="flex flex-col gap-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                item.active 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={20} className={item.active ? 'opacity-100' : 'opacity-70'} />
              <span className="font-medium text-base">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Header / Top Nav */}
        <header className="flex justify-end items-center px-8 py-6 gap-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search" 
              className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors w-64 backdrop-blur-md"
            />
          </div>
          <button className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white backdrop-blur-md">
            <Bell size={20} />
          </button>
          <div className="w-10 h-10 rounded-full bg-gray-500 overflow-hidden border border-white/20 cursor-pointer">
            <img src="https://i.pravatar.cc/150?img=5" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </header>

        <div className="px-8 pb-8 flex flex-col gap-6 max-w-7xl">
          
          {/* Main Top Card */}
          <div className={`${glassEffect} rounded-[12px] p-6 flex justify-between items-center`}>
            <div>
              <h1 className="text-2xl font-bold mb-2 text-white">Asian Paint</h1>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>Delhi</span>
                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                <span>Site Incharge: <span className="text-gray-200">Rajesh Sharma</span></span>
                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                <span>Forecast</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-medium border border-emerald-500/20 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                Approved
              </span>
              <button className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium flex items-center gap-2 transition-colors">
                <Download size={16} />
                Download Invoice
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className={`${glassEffect} rounded-lg p-1 flex inline-flex self-start`}>
            {['Invoice 1', 'Invoice 2', 'Invoice 3'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab 
                    ? 'bg-white/5 text-white shadow-sm' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Rental Section Container */}
          <div className={`${glassEffect} rounded-[16px] p-6 mt-2`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-yellow-500/20 text-yellow-500">
                <Building2 size={20} />
              </div>
              <h2 className="text-lg font-semibold">Rental</h2>
            </div>

            <div className="flex flex-col gap-6">
              {/* Tools Table Component */}
              <div className="rounded-xl border border-white/10 overflow-hidden bg-[#1B2028]/40">
                <div className="flex justify-between items-center p-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-black/50 accent-blue-500" defaultChecked />
                    <h3 className="text-base font-medium">Tools</h3>
                  </div>
                  <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full">{toolsData.length} Items</span>
                </div>
                
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-white/[0.02] border-b border-white/5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <div className="col-span-1"></div>
                  <div className="col-span-1">S.NO.</div>
                  <div className="col-span-6">DESCRIPTION</div>
                  <div className="col-span-2">QTY</div>
                  <div className="col-span-2 text-right">AMOUNT</div>
                </div>

                {/* Table Body */}
                {toolsData.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 px-4 py-4 border-b border-white/5 text-sm items-center hover:bg-white/[0.02] transition-colors last:border-0">
                    <div className="col-span-1">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-black/50 accent-blue-500" defaultChecked />
                    </div>
                    <div className="col-span-1 text-gray-400">{item.id}</div>
                    <div className="col-span-6">{item.desc}</div>
                    <div className="col-span-2 text-gray-300">{item.qty}</div>
                    <div className="col-span-2 text-right">{item.amount}</div>
                  </div>
                ))}
              </div>

              {/* Rooms Table Component */}
              <div className="rounded-xl border border-white/10 overflow-hidden bg-[#1B2028]/40">
                <div className="flex justify-between items-center p-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-black/50 accent-blue-500" defaultChecked />
                    <h3 className="text-base font-medium">Rooms</h3>
                  </div>
                  <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full">{roomsData.length} Items</span>
                </div>
                
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-white/[0.02] border-b border-white/5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <div className="col-span-1"></div>
                  <div className="col-span-1">S.NO.</div>
                  <div className="col-span-6">DESCRIPTION</div>
                  <div className="col-span-2">QTY</div>
                  <div className="col-span-2 text-right">AMOUNT</div>
                </div>

                {/* Table Body */}
                {roomsData.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 px-4 py-4 border-b border-white/5 text-sm items-center hover:bg-white/[0.02] transition-colors last:border-0">
                    <div className="col-span-1">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-black/50 accent-blue-500" defaultChecked />
                    </div>
                    <div className="col-span-1 text-gray-400">{item.id}</div>
                    <div className="col-span-6">{item.desc}</div>
                    <div className="col-span-2 text-gray-300">{item.qty}</div>
                    <div className="col-span-2 text-right">{item.amount}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default NewDashboardPage;