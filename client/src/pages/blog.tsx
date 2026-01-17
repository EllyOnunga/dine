import { useQuery } from "@tanstack/react-query";
import { Blog } from "@shared/schema";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Link } from "wouter";
import { ChevronRight, Calendar, User } from "lucide-react";

export default function BlogPage() {
    const { data: blogs, isLoading } = useQuery<Blog[]>({
        queryKey: ["/api/blogs"],
    });

    if (isLoading) {
        return (
            <div className="min-h-screen pt-24 bg-background">
                <div className="container mx-auto px-4">
                    <Skeleton className="h-12 w-64 mb-8" />
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-80 rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <section className="relative py-24 bg-primary text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1495195129352-aec329a6d7ca?q=80&w=2000')] bg-cover bg-center opacity-20" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4">Savannah Stories</h1>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto font-light">
                            Insights into our culinary philosophy, seasonal ingredients, and the vibrant culture of Karen.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {blogs?.map((blog, index) => (
                            <motion.div
                                key={blog.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="group h-full flex flex-col border-border/50 bg-card hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden">
                                    <div className="relative h-64 overflow-hidden">
                                        <img
                                            src={blog.image}
                                            alt={blog.title}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <Badge className="bg-primary text-white border-none">
                                                {blog.category}
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardHeader className="p-6">
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {blog.createdAt ? format(new Date(blog.createdAt), "MMM d, yyyy") : ""}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <User className="w-3 h-3" />
                                                {blog.author}
                                            </span>
                                        </div>
                                        <CardTitle className="text-2xl font-serif font-bold group-hover:text-primary transition-colors">
                                            {blog.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 pt-0 flex-1 flex flex-col justify-between">
                                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-6">
                                            {blog.content}
                                        </p>
                                        <Link href={`/blog/${blog.id}`}>
                                            <button className="text-primary font-bold flex items-center gap-2 group/btn">
                                                Read More <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                            </button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                        {blogs?.length === 0 && (
                            <div className="col-span-full text-center py-20">
                                <p className="text-muted-foreground italic text-lg">More stories coming soon...</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
