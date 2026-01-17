import { useQuery } from "@tanstack/react-query";
import { Blog } from "@shared/schema";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Calendar, User, Clock, Share2 } from "lucide-react";
import { format } from "date-fns";

export default function BlogDetail() {
    const { id } = useParams();
    const { data: blog, isLoading } = useQuery<Blog>({
        queryKey: [`/api/blogs/${id}`],
    });

    if (isLoading) {
        return (
            <div className="min-h-screen pt-24 bg-background">
                <div className="container mx-auto px-4 max-w-4xl">
                    <Skeleton className="h-12 w-3/4 mb-4" />
                    <Skeleton className="h-6 w-1/4 mb-12" />
                    <Skeleton className="h-[400px] w-full rounded-2xl mb-12" />
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-3xl font-serif font-bold mb-4">Post Not Found</h2>
                    <Link href="/blog">
                        <Button variant="outline">Back to Blog</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Article Header */}
            <article className="pt-32 pb-24">
                <div className="container mx-auto px-4 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <Link href="/blog">
                            <button className="flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all mb-8">
                                <ChevronLeft className="w-4 h-4" /> Back to Stories
                            </button>
                        </Link>

                        <div className="space-y-4">
                            <span className="text-primary font-bold uppercase tracking-widest text-xs">
                                {blog.category}
                            </span>
                            <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground leading-[1.1]">
                                {blog.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pt-4 border-b border-border pb-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium text-foreground">{blog.author}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {blog.createdAt ? format(new Date(blog.createdAt), "MMMM d, yyyy") : ""}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    5 min read
                                </div>
                            </div>
                        </div>

                        <div className="relative h-[500px] w-full rounded-[2rem] overflow-hidden shadow-2xl">
                            <img
                                src={blog.image}
                                alt={blog.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="prose prose-lg max-w-none dark:prose-invert">
                            {blog.content.split('\n').map((paragraph, i) => (
                                <p key={i} className="text-lg text-muted-foreground leading-relaxed mb-6">
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        <div className="mt-16 pt-8 border-t border-border flex justify-between items-center">
                            <div className="flex gap-4">
                                <Button variant="outline" size="sm" className="rounded-full gap-2">
                                    <Share2 className="w-4 h-4" /> Share Story
                                </Button>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-xs font-bold uppercase tracking-tighter text-muted-foreground">Tags:</span>
                                <span className="text-xs font-medium text-primary">#SavannahSpice</span>
                                <span className="text-xs font-medium text-primary">#NairobiDining</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </article>

            {/* Recommended Section Placeholder */}
            <section className="py-24 bg-muted/30">
                <div className="container mx-auto px-4 max-w-6xl text-center">
                    <h2 className="text-3xl font-serif font-bold mb-12">Keep Reading</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-background p-8 rounded-3xl border border-border/50 text-left">
                            <h3 className="text-xl font-serif font-bold mb-4 italic">Next Story</h3>
                            <p className="text-muted-foreground mb-6">Explore the secret recipes behind our Swahili coconut curry.</p>
                            <Link href="/blog">
                                <Button variant="link" className="p-0 text-primary">Read More →</Button>
                            </Link>
                        </div>
                        <div className="bg-background p-8 rounded-3xl border border-border/50 text-left">
                            <h3 className="text-xl font-serif font-bold mb-4 italic">Previous Story</h3>
                            <p className="text-muted-foreground mb-6">How we source our organic greens from local Karen farmers.</p>
                            <Link href="/blog">
                                <Button variant="link" className="p-0 text-primary">Read More →</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
