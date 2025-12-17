import { Metadata } from "next";
import Link from "next/link";
import { Calendar, User, ArrowRight, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Travel Guide & Blog - Tips, Destinations & Travel Advice",
  description:
    "Explore our travel guide with expert tips, destination guides, and travel advice to help you plan your perfect trip.",
};

// Blog posts data (in a real app, this would come from a CMS or database)
const blogPosts = [
  {
    id: "1",
    slug: "how-to-choose-travel-agency",
    title: "How to Choose the Right Travel Agency for Your Next Trip",
    excerpt:
      "Discover the key factors to consider when selecting a travel agency. From reviews to specializations, learn what makes a great travel partner.",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=500&fit=crop",
    date: "2024-12-15",
    author: "Travel Expert",
    category: "Travel Tips",
    readTime: "5 min read",
  },
  {
    id: "2",
    slug: "top-destinations-2025",
    title: "Top 10 Travel Destinations for 2025",
    excerpt:
      "From exotic beaches to historic cities, discover the must-visit destinations that should be on your travel bucket list this year.",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=500&fit=crop",
    date: "2024-12-10",
    author: "Destination Expert",
    category: "Destinations",
    readTime: "8 min read",
  },
  {
    id: "3",
    slug: "morocco-travel-guide",
    title: "Complete Morocco Travel Guide: What You Need to Know",
    excerpt:
      "Planning a trip to Morocco? Learn about the best time to visit, must-see attractions, cultural tips, and how to find the best local agencies.",
    image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800&h=500&fit=crop",
    date: "2024-12-05",
    author: "Morocco Specialist",
    category: "Destinations",
    readTime: "10 min read",
  },
  {
    id: "4",
    slug: "budget-travel-tips",
    title: "Budget Travel Tips: How to Explore More for Less",
    excerpt:
      "Traveling doesn't have to break the bank. Learn expert tips for finding deals, saving money, and maximizing your travel budget.",
    image: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&h=500&fit=crop",
    date: "2024-12-01",
    author: "Budget Traveler",
    category: "Travel Tips",
    readTime: "6 min read",
  },
  {
    id: "5",
    slug: "group-travel-benefits",
    title: "The Benefits of Group Travel with a Professional Agency",
    excerpt:
      "Discover why booking group travel through a professional agency can enhance your experience and save you time and money.",
    image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&h=500&fit=crop",
    date: "2024-11-28",
    author: "Group Travel Expert",
    category: "Travel Tips",
    readTime: "5 min read",
  },
  {
    id: "6",
    slug: "travel-insurance-guide",
    title: "Travel Insurance: Why You Need It and How to Choose",
    excerpt:
      "Don't travel without protection. Learn about the types of travel insurance, what they cover, and how to select the right policy.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=500&fit=crop",
    date: "2024-11-25",
    author: "Insurance Advisor",
    category: "Travel Tips",
    readTime: "7 min read",
  },
];

const categories = ["All", "Travel Tips", "Destinations", "News"];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero */}
      <section className="hero-gradient text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Travel Guide</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Expert tips, destination guides, and travel advice to help you plan
            your perfect adventure.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white border-b border-border py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  category === "All"
                    ? "bg-primary text-white"
                    : "bg-muted hover:bg-primary/10"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Featured Post */}
          <div className="mb-12">
            <Link
              href={`/blog/${blogPosts[0].slug}`}
              className="block bg-white rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-shadow"
            >
              <div className="grid md:grid-cols-2">
                <div className="aspect-video md:aspect-auto">
                  <img
                    src={blogPosts[0].image}
                    alt={blogPosts[0].title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4 w-fit">
                    {blogPosts[0].category}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 hover:text-primary transition-colors">
                    {blogPosts[0].title}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {blogPosts[0].excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {blogPosts[0].author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(blogPosts[0].date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {blogPosts[0].readTime}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Post Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="bg-white rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow group"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium mb-3">
                    {post.category}
                  </span>
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="inline-flex items-center gap-2 bg-muted text-foreground px-8 py-3 rounded-full font-semibold hover:bg-muted/80 transition-colors">
              Load More Articles
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Stay Updated
            </h2>
            <p className="text-muted-foreground mb-8">
              Subscribe to our newsletter for the latest travel tips,
              destination guides, and exclusive deals.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
