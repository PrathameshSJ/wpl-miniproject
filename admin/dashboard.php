<?php
require_once '../client/config/db.php';
require_once '../client/config/auth.php';
requireAdmin();
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <title>BakeEase Admin - Sales Dashboard</title>
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
        <script src="js/tailwind-config.js"></script>
        <link href="styles/dashboard.css" rel="stylesheet" />
    </head>
    <body class="bg-surface text-on-surface flex min-h-screen">
        <div id="sidebar-container"></div>
        <main class="ml-[240px] flex-1 min-h-screen bg-[#F5F0EB]">
            <div id="topbar-container"></div>
            <div class="p-8 space-y-8">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-b-4 border-primary-container">
                        <p class="text-on-surface-variant text-sm font-medium mb-2 uppercase tracking-wider">Total Revenue Today</p>
                        <div class="flex items-baseline gap-2">
                            <h3 class="text-3xl font-bold text-on-surface">₹12,480</h3>
                            <span class="text-emerald-600 text-sm font-bold flex items-center">
                                <span class="material-symbols-outlined text-xs" data-icon="trending_up">trending_up</span>
                                18%
                            </span>
                        </div>
                    </div>
                    <div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-b-4 border-primary-container">
                        <p class="text-on-surface-variant text-sm font-medium mb-2 uppercase tracking-wider">Orders Today</p>
                        <div class="flex items-baseline gap-2">
                            <h3 class="text-3xl font-bold text-on-surface">34</h3>
                            <span class="text-emerald-600 text-sm font-bold flex items-center">
                                <span class="material-symbols-outlined text-xs" data-icon="add">add</span>
                                5
                            </span>
                        </div>
                    </div>
                    <div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-b-4 border-secondary">
                        <p class="text-on-surface-variant text-sm font-medium mb-2 uppercase tracking-wider">Pending Orders</p>
                        <div class="flex items-baseline gap-2">
                            <h3 class="text-3xl font-bold text-on-surface">8</h3>
                            <span class="text-stone-400 text-sm font-medium">Stable</span>
                        </div>
                    </div>
                    <div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-b-4 border-error">
                        <p class="text-on-surface-variant text-sm font-medium mb-2 uppercase tracking-wider">Low Stock Alerts</p>
                        <div class="flex items-center gap-3">
                            <h3 class="text-3xl font-bold text-on-surface">3</h3>
                            <span class="bg-error-container text-on-error-container text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Warning</span>
                        </div>
                    </div>
                </div>
                <div class="bg-surface-container-lowest p-8 rounded-xl shadow-sm">
                    <div class="flex justify-between items-center mb-8">
                        <h3 class="text-xl font-bold text-on-surface">Revenue Last 7 Days</h3>
                        <div class="flex gap-2">
                            <button class="bg-surface-container text-on-surface-variant text-xs font-bold px-3 py-1.5 rounded-full">Weekly</button>
                            <button class="hover:bg-surface-container text-on-surface-variant text-xs font-bold px-3 py-1.5 rounded-full transition-colors">Monthly</button>
                        </div>
                    </div>
                    <div class="h-[300px] flex items-end justify-between gap-4 px-4 relative">
                        <div class="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[10px] text-stone-400 font-bold pr-2">
                            <span>₹20k</span>
                            <span>₹15k</span>
                            <span>₹10k</span>
                            <span>₹5k</span>
                            <span>₹0</span>
                        </div>
                        <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                            <div class="w-full max-w-[40px] bg-primary-container/20 rounded-t-lg transition-all hover:bg-primary-container" style="height: 60%"></div>
                            <span class="text-xs font-bold text-on-surface-variant">Mon</span>
                        </div>
                        <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                            <div class="w-full max-w-[40px] bg-primary-container/20 rounded-t-lg transition-all hover:bg-primary-container" style="height: 45%"></div>
                            <span class="text-xs font-bold text-on-surface-variant">Tue</span>
                        </div>
                        <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                            <div class="w-full max-w-[40px] bg-primary-container/20 rounded-t-lg transition-all hover:bg-primary-container" style="height: 85%"></div>
                            <span class="text-xs font-bold text-on-surface-variant">Wed</span>
                        </div>
                        <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                            <div class="w-full max-w-[40px] bg-primary-container/20 rounded-t-lg transition-all hover:bg-primary-container" style="height: 70%"></div>
                            <span class="text-xs font-bold text-on-surface-variant">Thu</span>
                        </div>
                        <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                            <div class="w-full max-w-[40px] bg-primary-container/20 rounded-t-lg transition-all hover:bg-primary-container" style="height: 55%"></div>
                            <span class="text-xs font-bold text-on-surface-variant">Fri</span>
                        </div>
                        <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                            <div class="w-full max-w-[40px] bg-primary-container rounded-t-lg transition-all hover:bg-primary" style="height: 95%"></div>
                            <span class="text-xs font-bold text-on-surface">Sat</span>
                        </div>
                        <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                            <div class="w-full max-w-[40px] bg-primary-container/20 rounded-t-lg transition-all hover:bg-primary-container" style="height: 40%"></div>
                            <span class="text-xs font-bold text-on-surface-variant">Sun</span>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div class="lg:col-span-2 bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
                        <div class="p-6 border-b border-surface-container flex justify-between items-center">
                            <h3 class="text-xl font-bold text-on-surface">Recent Orders</h3>
                            <a class="text-primary font-bold text-xs uppercase tracking-widest hover:underline" href="#">View All</a>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left">
                                <thead>
                                    <tr class="bg-surface-container-low text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                                        <th class="px-6 py-4">Order ID</th>
                                        <th class="px-6 py-4">Customer</th>
                                        <th class="px-6 py-4">Items</th>
                                        <th class="px-6 py-4 text-right">Amount</th>
                                        <th class="px-6 py-4 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody class="text-sm">
                                    <tr class="border-b border-surface-container hover:bg-surface-container-low transition-colors">
                                        <td class="px-6 py-4 font-mono font-semibold">#BE1205</td>
                                        <td class="px-6 py-4">Rohan Sharma</td>
                                        <td class="px-6 py-4">1x Sourdough, 2x Croissants</td>
                                        <td class="px-6 py-4 text-right font-bold">₹840</td>
                                        <td class="px-6 py-4 text-center">
                                            <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[11px] font-bold">Baking</span>
                                        </td>
                                    </tr>
                                    <tr class="border-b border-surface-container hover:bg-surface-container-low transition-colors">
                                        <td class="px-6 py-4 font-mono font-semibold">#BE1204</td>
                                        <td class="px-6 py-4">Priya V.</td>
                                        <td class="px-6 py-4">Choco Truffle Cake (1kg)</td>
                                        <td class="px-6 py-4 text-right font-bold">₹1,200</td>
                                        <td class="px-6 py-4 text-center">
                                            <span class="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-[11px] font-bold">Pending</span>
                                        </td>
                                    </tr>
                                    <tr class="border-b border-surface-container hover:bg-surface-container-low transition-colors">
                                        <td class="px-6 py-4 font-mono font-semibold">#BE1203</td>
                                        <td class="px-6 py-4">Anil Gupta</td>
                                        <td class="px-6 py-4">6x Assorted Cupcakes</td>
                                        <td class="px-6 py-4 text-right font-bold">₹450</td>
                                        <td class="px-6 py-4 text-center">
                                            <span class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[11px] font-bold">Delivered</span>
                                        </td>
                                    </tr>
                                    <tr class="border-b border-surface-container hover:bg-surface-container-low transition-colors">
                                        <td class="px-6 py-4 font-mono font-semibold">#BE1202</td>
                                        <td class="px-6 py-4">Sonia Mehta</td>
                                        <td class="px-6 py-4">2x Baguettes</td>
                                        <td class="px-6 py-4 text-right font-bold">₹320</td>
                                        <td class="px-6 py-4 text-center">
                                            <span class="bg-stone-200 text-stone-600 px-3 py-1 rounded-full text-[11px] font-bold">Cancelled</span>
                                        </td>
                                    </tr>
                                    <tr class="hover:bg-surface-container-low transition-colors">
                                        <td class="px-6 py-4 font-mono font-semibold">#BE1201</td>
                                        <td class="px-6 py-4">Vikram Singh</td>
                                        <td class="px-6 py-4">Birthday Hamper XL</td>
                                        <td class="px-6 py-4 text-right font-bold">₹3,400</td>
                                        <td class="px-6 py-4 text-center">
                                            <span class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[11px] font-bold">Delivered</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="bg-surface-container-lowest rounded-xl shadow-sm p-6 flex flex-col">
                        <h3 class="text-xl font-bold text-on-surface mb-6">Best Sellers this week</h3>
                        <div class="space-y-6 flex-1">
                            <div class="flex items-center gap-4 group">
                                <span class="w-8 h-8 flex items-center justify-center bg-primary text-white font-bold rounded-lg shrink-0">1</span>
                                <div class="flex-1">
                                    <p class="font-bold text-on-surface leading-tight">Chocolate Truffle Cake</p>
                                    <p class="text-xs text-on-surface-variant">42 units sold</p>
                                </div>
                                <div class="text-right">
                                    <p class="font-bold text-on-surface text-sm">₹50,400</p>
                                    <span class="material-symbols-outlined text-emerald-600 text-sm" data-icon="north">north</span>
                                </div>
                            </div>
                            <div class="flex items-center gap-4">
                                <span class="w-8 h-8 flex items-center justify-center bg-surface-container text-on-surface font-bold rounded-lg shrink-0">2</span>
                                <div class="flex-1">
                                    <p class="font-bold text-on-surface leading-tight">Vanilla Cupcakes</p>
                                    <p class="text-xs text-on-surface-variant">38 units sold</p>
                                </div>
                                <div class="text-right">
                                    <p class="font-bold text-on-surface text-sm">₹22,800</p>
                                    <span class="material-symbols-outlined text-emerald-600 text-sm" data-icon="north">north</span>
                                </div>
                            </div>
                            <div class="flex items-center gap-4">
                                <span class="w-8 h-8 flex items-center justify-center bg-surface-container text-on-surface font-bold rounded-lg shrink-0">3</span>
                                <div class="flex-1">
                                    <p class="font-bold text-on-surface leading-tight">Artisan Sourdough</p>
                                    <p class="text-xs text-on-surface-variant">31 units sold</p>
                                </div>
                                <div class="text-right">
                                    <p class="font-bold text-on-surface text-sm">₹14,570</p>
                                    <span class="material-symbols-outlined text-stone-400 text-sm" data-icon="horizontal_rule">horizontal_rule</span>
                                </div>
                            </div>
                            <div class="flex items-center gap-4">
                                <span class="w-8 h-8 flex items-center justify-center bg-surface-container text-on-surface font-bold rounded-lg shrink-0">4</span>
                                <div class="flex-1">
                                    <p class="font-bold text-on-surface leading-tight">Almond Croissants</p>
                                    <p class="text-xs text-on-surface-variant">29 units sold</p>
                                </div>
                                <div class="text-right">
                                    <p class="font-bold text-on-surface text-sm">₹8,120</p>
                                    <span class="material-symbols-outlined text-red-500 text-sm" data-icon="south">south</span>
                                </div>
                            </div>
                            <div class="flex items-center gap-4">
                                <span class="w-8 h-8 flex items-center justify-center bg-surface-container text-on-surface font-bold rounded-lg shrink-0">5</span>
                                <div class="flex-1">
                                    <p class="font-bold text-on-surface leading-tight">Blueberry Muffins</p>
                                    <p class="text-xs text-on-surface-variant">25 units sold</p>
                                </div>
                                <div class="text-right">
                                    <p class="font-bold text-on-surface text-sm">₹6,250</p>
                                    <span class="material-symbols-outlined text-emerald-600 text-sm" data-icon="north">north</span>
                                </div>
                            </div>
                        </div>
                        <button class="mt-8 w-full border border-outline-variant py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-surface-container transition-colors">Download Performance Report</button>
                    </div>
                </div>
                <div class="relative h-64 w-full rounded-2xl overflow-hidden shadow-xl mt-12">
                    <img class="w-full h-full object-cover grayscale opacity-20" alt="Bakery Background" src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=2000" />
                    <div class="absolute inset-0 bg-gradient-to-r from-primary/90 to-transparent flex flex-col justify-center px-12 text-white">
                        <h4 class="font-headline text-3xl mb-2">Baking Success One Order at a Time</h4>
                        <p class="max-w-md text-white/80 font-medium">Amit, your revenue is up by 18% compared to last Wednesday. Keep an eye on those low stock alerts to maintain the momentum.</p>
                    </div>
                </div>
            </div>
        </main>
        <script src="js/dashboard.js"></script>
    </body>
</html>