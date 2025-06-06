import { Card, CardContent, CardHeader } from '../ui/card'
import { BookOpen, Users, Calendar, BarChart3, FileText, GraduationCap, Clock, Award } from 'lucide-react'

export function Features() {
    return (
        <section className="bg-black py-16 md:py-32 relative overflow-hidden">
            {/* Subtle Background glow effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-900/10 via-black to-purple-900/10"></div>
            
            {/* Gentle floating orbs */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/3 rounded-full blur-3xl"></div>
            
            {/* Minimal accent orbs */}
            <div className="absolute top-3/4 left-1/6 w-48 h-48 bg-pink-500/4 rounded-full blur-2xl"></div>
            <div className="absolute top-1/6 right-1/3 w-72 h-72 bg-blue-500/3 rounded-full blur-3xl"></div>
            
            <div className="mx-auto max-w-5xl px-6 relative z-10">
                <div className="mx-auto grid gap-2 sm:grid-cols-5">
                    <Card className="group overflow-hidden shadow-violet-500/10 bg-black backdrop-blur-sm border-violet-500/20 sm:col-span-3 sm:rounded-none sm:rounded-tl-xl hover:shadow-violet-500/20 hover:shadow-lg hover:border-violet-400/30 transition-all duration-500 relative">
                        {/* Subtle Card glow effects */}
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/3 via-transparent to-purple-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-violet-500/10 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500 -z-10"></div>
                        
                        {/* Radial gradient overlay spread throughout the card */}
                        <div className="absolute inset-0 [background:radial-gradient(75%_95%_at_50%_0%,transparent,rgba(0,0,0,0.4)_100%)]"></div>
                        
                        <CardHeader className="relative z-10">
                            <div className="md:p-6">
                                <p className="font-medium text-violet-400 group-hover:text-violet-300 transition-colors duration-300 drop-shadow-sm">Smart Attendance Management</p>
                                <p className="text-neutral-400 mt-3 max-w-sm text-sm group-hover:text-neutral-300 transition-colors duration-300">QR-based attendance system with real-time tracking, comprehensive attendance history, and detailed analytics for students and faculty.</p>
                            </div>
                        </CardHeader>

                        <div className="relative h-fit pl-6 md:pl-12 z-10">
                            {/* Multiple layered fade overlays from outer container - extends beyond image border */}
                            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-20"></div>
                            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none z-20"></div>
                            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none z-20"></div>
                            <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-black via-black/80 to-transparent pointer-events-none z-20"></div>
                            <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-black via-black/70 to-transparent pointer-events-none z-20"></div>
                            <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-black via-black/60 to-transparent pointer-events-none z-20"></div>
                            
                            {/* Extended vignette effect across entire container */}
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/10 to-black/30 pointer-events-none z-20"></div>
                            <div className="absolute inset-0 shadow-inner shadow-black/30 pointer-events-none z-20"></div>
                            
                            <div className="bg-black overflow-hidden rounded-tl-lg border-l border-t border-violet-500/30 group-hover:border-violet-400/40 pl-2 pt-2 shadow-inner shadow-violet-500/5 group-hover:shadow-violet-500/10 transition-all duration-300 relative">
                                <img
                                    src="/land/attendance.png"
                                    className="opacity-90 group-hover:opacity-100 transition-opacity duration-300 w-full h-auto"
                                    alt="Dashboard analytics interface"
                                    width={1207}
                                    height={929}
                                />
                            </div>
                            {/* Enhanced external shadow for depth */}
                            <div className="absolute -bottom-4 -right-4 w-full h-full bg-black/40 rounded-tl-lg blur-lg -z-10"></div>
                            <div className="absolute -bottom-2 -right-2 w-full h-full bg-violet-500/10 rounded-tl-lg blur-md -z-10"></div>
                        </div>
                    </Card>

                    <Card className="group overflow-hidden shadow-violet-500/10 bg-black backdrop-blur-sm border-violet-500/20 sm:col-span-2 sm:rounded-none sm:rounded-tr-xl hover:shadow-violet-500/20 hover:shadow-lg hover:border-violet-400/30 transition-all duration-500 relative">
                        {/* Subtle Card glow effects */}
                        <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/3 via-transparent to-violet-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/10 via-violet-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500 -z-10"></div>
                        
                        {/* Radial gradient overlay spread throughout the card */}
                        <div className="absolute inset-0 [background:radial-gradient(50%_75%_at_75%_50%,transparent,rgba(0,0,0,0.4)_100%)]"></div>

                        <p className="mx-auto my-6 max-w-md text-balance px-6 text-center text-lg font-semibold sm:text-2xl md:p-6 text-violet-300 group-hover:text-violet-200 transition-colors duration-300 drop-shadow-sm relative z-10">AI Learning Assistant</p>

                        <CardContent className="mt-auto h-fit relative z-10">
                            <div className="relative mb-6 sm:mb-0 -ml-6 md:-ml-12 lg:-ml-28">
                                {/* Multiple layered fade overlays from outer card - extends beyond image border */}
                                <div className="absolute top-0 bottom-0 left-0 w-48 bg-gradient-to-r from-black via-black/80 to-transparent pointer-events-none z-20"></div>
                                <div className="absolute top-0 bottom-0 left-0 w-40 bg-gradient-to-r from-black via-black/70 to-transparent pointer-events-none z-20"></div>
                                <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-black via-black/60 to-transparent pointer-events-none z-20"></div>
                                <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-black via-black/50 to-transparent pointer-events-none z-20"></div>
                                
                                {/* Extended vignette effect across entire container */}
                                <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-black/10 to-black/30 pointer-events-none z-20"></div>
                                <div className="absolute inset-0 shadow-inner shadow-black/30 pointer-events-none z-20"></div>
                                
                                <div className="aspect-76/59 overflow-hidden rounded-r-xl border-2 border-violet-500/30 group-hover:border-violet-400/40 shadow-inner shadow-violet-500/5 group-hover:shadow-violet-500/10 transition-all duration-300 relative bg-black">
                                    <img
                                        src="/land/aibot.jpeg"
                                        className="opacity-90 group-hover:opacity-100 transition-opacity duration-300 h-48 md:h-80 object-cover"
                                        alt="Course management interface"
                                        width={1207}
                                        height={929}
                                    />
                                </div>
                                {/* Enhanced external shadows for depth */}
                                <div className="absolute -top-4 -left-4 w-full h-full bg-black/50 rounded-r-xl blur-xl -z-10"></div>
                                <div className="absolute -top-2 -left-2 w-full h-full bg-purple-500/15 rounded-r-xl blur-lg -z-10"></div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="group p-6 shadow-violet-500/10 bg-black backdrop-blur-sm border-violet-500/20 sm:col-span-2 sm:rounded-none sm:rounded-bl-xl md:p-12 hover:shadow-violet-500/20 hover:shadow-lg hover:border-violet-400/30 transition-all duration-500 relative">
                        {/* Subtle Card glow effects */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/3 via-transparent to-purple-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500 -z-10"></div>
                        
                        {/* Radial gradient overlay spread throughout the card */}
                        <div className="absolute inset-0 [background:radial-gradient(60%_80%_at_50%_20%,transparent,rgba(0,0,0,0.3)_100%)]"></div>
                        
                        <p className="mx-auto mb-8 max-w-md text-balance text-center text-lg font-semibold sm:text-2xl text-violet-300 group-hover:text-violet-200 transition-colors duration-300 drop-shadow-sm relative z-10">Progress Tracking</p>

                        <div className="space-y-4 relative z-10">
                            {/* Progress bars */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-neutral-400 group-hover:text-neutral-300 transition-colors duration-300 flex items-center gap-2">
                                        <GraduationCap className="size-4 text-violet-400" />
                                        Completed Courses
                                    </span>
                                    <span className="text-violet-400 font-medium">85%</span>
                                </div>
                                <div className="w-full bg-neutral-800 rounded-full h-2 relative overflow-hidden">
                                    <div className="bg-gradient-to-r from-violet-500 to-purple-500 h-2 rounded-full w-[85%] shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/30 transition-all duration-300"></div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-neutral-400 group-hover:text-neutral-300 transition-colors duration-300 flex items-center gap-2">
                                        <Award className="size-4 text-violet-400" />
                                        Assignments Submitted
                                    </span>
                                    <span className="text-violet-400 font-medium">92%</span>
                                </div>
                                <div className="w-full bg-neutral-800 rounded-full h-2 relative overflow-hidden">
                                    <div className="bg-gradient-to-r from-violet-500 to-purple-500 h-2 rounded-full w-[92%] shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/30 transition-all duration-300"></div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-neutral-400 group-hover:text-neutral-300 transition-colors duration-300 flex items-center gap-2">
                                        <Clock className="size-4 text-violet-400" />
                                        Study Hours
                                    </span>
                                    <span className="text-violet-400 font-medium">78%</span>
                                </div>
                                <div className="w-full bg-neutral-800 rounded-full h-2 relative overflow-hidden">
                                    <div className="bg-gradient-to-r from-violet-500 to-purple-500 h-2 rounded-full w-[78%] shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/30 transition-all duration-300"></div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                            </div>
                        </div>
                    </Card>
                    
                    <Card className="group relative shadow-violet-500/10 bg-black backdrop-blur-sm border-violet-500/20 sm:col-span-3 sm:rounded-none sm:rounded-br-xl hover:shadow-violet-500/20 hover:shadow-lg hover:border-violet-400/30 transition-all duration-500">
                        {/* Subtle Card glow effects */}
                        <div className="absolute inset-0 bg-gradient-to-tl from-purple-500/3 via-transparent to-violet-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-violet-500/10 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500 -z-10"></div>
                        
                        {/* Radial gradient overlay spread throughout the card */}
                        <div className="absolute inset-0 [background:radial-gradient(70%_85%_at_30%_80%,transparent,rgba(0,0,0,0.3)_100%)]"></div>
                        
                        <CardHeader className="p-6 md:p-12 relative z-10">
                            <p className="font-medium text-violet-400 group-hover:text-violet-300 transition-colors duration-300 drop-shadow-sm">Platform Integration</p>
                            <p className="text-neutral-400 mt-2 max-w-sm text-sm group-hover:text-neutral-300 transition-colors duration-300">Seamlessly integrated with modern educational tools and assessment platforms.</p>
                        </CardHeader>
                        <CardContent className="relative h-fit px-6 pb-6 md:px-12 md:pb-12 z-10">
                            <div className="grid grid-cols-4 gap-2 md:grid-cols-6">
                                <div className="rounded-lg aspect-square border border-violet-500/30 border-dashed hover:border-violet-400/40 transition-colors duration-300"></div>
                                <div className="rounded-lg bg-violet-500/20 flex aspect-square items-center justify-center border border-violet-500/30 p-4 hover:bg-violet-500/25 hover:border-violet-400/40 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300 relative group/item">
                                    <BookOpen className="size-6 text-violet-400 opacity-80 group-hover/item:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute inset-0 bg-violet-500/5 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <div className="rounded-lg aspect-square border border-violet-500/30 border-dashed hover:border-violet-400/40 transition-colors duration-300"></div>
                                <div className="rounded-lg bg-violet-500/20 flex aspect-square items-center justify-center border border-violet-500/30 p-4 hover:bg-violet-500/25 hover:border-violet-400/40 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300 relative group/item">
                                    <Users className="size-6 text-violet-400 opacity-80 group-hover/item:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute inset-0 bg-violet-500/5 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <div className="rounded-lg aspect-square border border-violet-500/30 border-dashed hover:border-violet-400/40 transition-colors duration-300"></div>
                                <div className="rounded-lg bg-violet-500/20 flex aspect-square items-center justify-center border border-violet-500/30 p-4 hover:bg-violet-500/25 hover:border-violet-400/40 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300 relative group/item">
                                    <BarChart3 className="size-6 text-violet-400 opacity-80 group-hover/item:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute inset-0 bg-violet-500/5 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
