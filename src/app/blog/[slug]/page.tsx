import { Metadata } from "next";
import Link from "next/link";
import { Calendar, User, Clock, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import CTASection from "@/components/ui/CTASection";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Blog posts data
const blogPosts: Record<string, {
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
}> = {
  "how-to-choose-travel-agency": {
    title: "How to Choose the Right Travel Agency for Your Next Trip",
    excerpt: "Discover the key factors to consider when selecting a travel agency.",
    content: `
      <p>Choosing the right travel agency can make the difference between a good trip and an unforgettable experience. With so many options available, it's important to know what to look for when selecting a travel partner.</p>

      <h2>1. Check Reviews and Ratings</h2>
      <p>One of the first things you should do is check the agency's reviews and ratings. Look for agencies with consistently high ratings (4 stars and above) and read through customer testimonials to understand their strengths and weaknesses.</p>

      <h2>2. Verify Their Specialization</h2>
      <p>Some agencies specialize in specific types of travel – adventure tours, luxury vacations, business travel, or specific destinations. Choose an agency that aligns with your travel needs and preferences.</p>

      <h2>3. Look for Certifications and Memberships</h2>
      <p>Reputable travel agencies often hold certifications from recognized bodies like IATA (International Air Transport Association) or are members of professional associations. These credentials indicate a commitment to quality and professionalism.</p>

      <h2>4. Compare Pricing and Value</h2>
      <p>While price is important, don't just go for the cheapest option. Consider what's included in the package – some agencies offer better value with included services like airport transfers, travel insurance, or guided tours.</p>

      <h2>5. Assess Their Communication</h2>
      <p>Good communication is essential. A reliable agency should be responsive, answer your questions thoroughly, and provide clear information about your booking.</p>

      <h2>6. Ask About Flexibility</h2>
      <p>Travel plans can change. Ask about the agency's cancellation and modification policies before booking. A good agency will offer reasonable flexibility.</p>

      <h2>Conclusion</h2>
      <p>Taking the time to research and choose the right travel agency will pay off in the quality of your travel experience. Use resources like TravelAgencies.World to compare agencies, read reviews, and find the perfect partner for your next adventure.</p>
    `,
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=600&fit=crop",
    date: "2024-12-15",
    author: "Travel Expert",
    category: "Travel Tips",
    readTime: "5 min read",
  },
  "top-destinations-2025": {
    title: "Top 10 Travel Destinations for 2025",
    excerpt: "From exotic beaches to historic cities, discover the must-visit destinations.",
    content: `
      <p>As we look ahead to 2025, the world offers more exciting travel opportunities than ever. Here are the top destinations that should be on your radar.</p>

      <h2>1. Morocco</h2>
      <p>From the bustling souks of Marrakech to the serene Sahara Desert, Morocco offers a perfect blend of culture, adventure, and relaxation. The country's diverse landscapes and rich history make it an ideal destination for all types of travelers.</p>

      <h2>2. Japan</h2>
      <p>With its perfect mix of ancient traditions and cutting-edge technology, Japan continues to captivate travelers. Cherry blossom season remains a highlight, but the country offers year-round attractions.</p>

      <h2>3. Portugal</h2>
      <p>Affordable, beautiful, and packed with history, Portugal has become Europe's hottest destination. From Lisbon's vibrant nightlife to Porto's wine cellars, there's something for everyone.</p>

      <h2>4. Costa Rica</h2>
      <p>For eco-travelers and adventure seekers, Costa Rica offers incredible biodiversity, stunning beaches, and world-class adventure activities.</p>

      <h2>5. Greece</h2>
      <p>Beyond the iconic Santorini, Greece offers countless islands to explore, ancient ruins, and some of the Mediterranean's best cuisine.</p>

      <h2>Planning Your Trip</h2>
      <p>No matter which destination calls to you, working with a knowledgeable travel agency can help you make the most of your trip. Browse our directory to find agencies specializing in your dream destination.</p>
    `,
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&h=600&fit=crop",
    date: "2024-12-10",
    author: "Destination Expert",
    category: "Destinations",
    readTime: "8 min read",
  },
  "morocco-travel-guide": {
    title: "Complete Morocco Travel Guide: What You Need to Know",
    excerpt: "Planning a trip to Morocco? Learn everything you need to know.",
    content: `
      <p>Morocco is a land of contrasts – from the Atlas Mountains to the Sahara Desert, from ancient medinas to modern cities. Here's your complete guide to planning an unforgettable Moroccan adventure.</p>

      <h2>Best Time to Visit</h2>
      <p>The best time to visit Morocco is during spring (March-May) and fall (September-November) when temperatures are pleasant. Summer can be extremely hot, especially in the desert, while winter is ideal for skiing in the Atlas Mountains.</p>

      <h2>Must-Visit Cities</h2>
      <ul>
        <li><strong>Marrakech:</strong> The iconic red city with its famous Jemaa el-Fnaa square</li>
        <li><strong>Fes:</strong> Home to the world's oldest university and a maze-like medina</li>
        <li><strong>Chefchaouen:</strong> The stunning blue city in the Rif Mountains</li>
        <li><strong>Casablanca:</strong> Morocco's modern economic capital</li>
      </ul>

      <h2>Cultural Tips</h2>
      <p>Morocco is a Muslim country with its own customs. Dress modestly, especially when visiting religious sites. Learn a few words in Arabic or French – locals appreciate the effort. Bargaining is expected in souks.</p>

      <h2>Getting Around</h2>
      <p>Morocco has good train connections between major cities. For more flexibility, consider hiring a driver or joining organized tours. Many travel agencies offer comprehensive packages that include transportation.</p>

      <h2>Finding the Right Agency</h2>
      <p>Morocco has hundreds of excellent travel agencies. Look for agencies with local knowledge, good reviews, and expertise in the experiences you're seeking. Our directory features many top-rated Moroccan agencies.</p>
    `,
    image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1200&h=600&fit=crop",
    date: "2024-12-05",
    author: "Morocco Specialist",
    category: "Destinations",
    readTime: "10 min read",
  },
};

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <Link href="/blog" className="text-primary hover:underline">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-white">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[500px]">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        <div className="absolute inset-0 flex items-end pb-16">
          <div className="container mx-auto px-4 text-white">
            <div className="max-w-4xl">
              <span className="inline-block bg-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6 shadow-lg">
                {post.category}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {post.title}
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl">
                {post.excerpt}
              </p>
              <div className="flex flex-wrap items-center gap-6 text-white/90">
                <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <User className="h-4 w-4" />
                  {post.author}
                </span>
                <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Clock className="h-4 w-4" />
                  {post.readTime}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Link>

            {/* Article Card */}
            <div className="bg-gradient-to-b from-muted/30 to-transparent rounded-2xl p-8 md:p-12 -mx-4 md:mx-0">
              <article
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {/* Author Card */}
            <div className="mt-12 p-6 bg-muted/50 rounded-2xl flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{post.author}</p>
                <p className="text-sm text-muted-foreground">Travel & Tourism Expert</p>
              </div>
            </div>

            {/* Share */}
            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="font-semibold mb-4 text-foreground">Share this article</h3>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="h-10 w-10 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="h-10 w-10 rounded-full bg-blue-700 text-white flex items-center justify-center hover:bg-blue-800 transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Related Articles */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold mb-6 text-foreground">Continue Reading</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Link href="/blog/how-to-choose-travel-agency" className="group">
                  <div className="bg-muted/30 rounded-xl p-4 hover:bg-muted/50 transition-colors">
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">How to Choose the Right Travel Agency</h4>
                    <p className="text-sm text-muted-foreground mt-2">5 min read</p>
                  </div>
                </Link>
                <Link href="/blog/top-destinations-2025" className="group">
                  <div className="bg-muted/30 rounded-xl p-4 hover:bg-muted/50 transition-colors">
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">Top 10 Travel Destinations for 2025</h4>
                    <p className="text-sm text-muted-foreground mt-2">8 min read</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection variant="secondary" />
    </div>
  );
}
