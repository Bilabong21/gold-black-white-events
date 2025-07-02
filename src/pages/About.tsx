
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart, BookOpen, HandHeart } from "lucide-react";
import { useState, useEffect } from "react";

const About = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(authStatus === 'true');
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header isAuthenticated={isAuthenticated} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            About <span className="text-yellow-400">BRCSA</span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            Building Reformed Church of Southern Africa - A community rooted in faith, united in purpose, and committed to serving God and our community.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-black mb-6">Our Mission</h2>
              <div className="w-16 h-1 bg-yellow-400 mb-6"></div>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                To proclaim the Gospel of Jesus Christ, nurture believers in their faith journey, and serve our community with love and compassion. We are committed to building a strong foundation of Reformed theology while embracing the diverse cultures and traditions of Southern Africa.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Through worship, education, fellowship, and outreach, we strive to be a beacon of hope and transformation in our communities, following Christ's example of love and service.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-black mb-6">Our Vision</h2>
              <div className="w-16 h-1 bg-yellow-400 mb-6"></div>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                To be a vibrant, growing church that impacts lives and transforms communities throughout Southern Africa. We envision congregations that are spiritually mature, culturally relevant, and socially engaged.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our vision extends to developing strong church leadership, fostering unity among diverse communities, and creating lasting positive change through practical expressions of God's love.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-black mb-4">Our Core Values</h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These fundamental principles guide our ministry and shape our community life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-3">Scripture-Centered</h3>
                <p className="text-gray-600">
                  We believe in the authority and sufficiency of God's Word as our foundation for faith and practice.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-3">Community</h3>
                <p className="text-gray-600">
                  We foster genuine fellowship and mutual support among believers from all backgrounds.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HandHeart className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-3">Service</h3>
                <p className="text-gray-600">
                  We are called to serve others with humility, compassion, and practical love in action.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-3">Grace</h3>
                <p className="text-gray-600">
                  We extend God's grace to all, embracing diversity and welcoming everyone with open hearts.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-black mb-6">Our Heritage</h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto mb-8"></div>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              The Building Reformed Church of Southern Africa has deep roots in the Reformed tradition, tracing our theological heritage to the Protestant Reformation. Our church was established to serve the spiritual needs of communities across Southern Africa, combining the rich Reformed theological tradition with the vibrant cultural expressions of our region.
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              Over the years, we have grown to include multiple congregations and various ministries, each serving their local communities while maintaining our shared commitment to Reformed theology and practical Christian living. Our church structure includes various conferences and synods that work together to coordinate ministry efforts and maintain theological integrity.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Today, BRCSA continues to be a vital force for spiritual growth, community development, and social transformation throughout Southern Africa, with ministries spanning youth work, community outreach, educational initiatives, and pastoral care.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
