"use client";

import { LandingContainer } from "@/components/landing/LandingContainer";
import { LandingCTA } from "@/components/landing/LandingCTA";
import { LandingHero } from "@/components/landing/LandingHero";
import Lenis from 'lenis'
import {
  EditOutlined,
  VideoCameraOutlined,
  CommentOutlined,
  LikeOutlined,
  UsergroupAddOutlined,
  InstagramOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { LandingSocialProof } from "@/components/landing/LandingSocialProof";
import { LandingHowItWorks } from "@/components/landing/LandingHowItWorks";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingTestimonials } from "@/components/landing/LandingTestimonials";
import { LandingPricing } from "@/components/landing/LandingPricing";
import LandingFAQ from "@/components/landing/LandingFAQ";
import { LandingSocialRating } from "@/components/landing/LandingSocialRating";
import { LandingAbout } from "@/components/landing/LandingAbout";
import { useEffect } from "react";
import { FloatingNav } from "@/components/ui/floating-navbar";

const features = [
  {
    heading: "Share Your Music",
    description:
      "Post images and videos to showcase your talent and connect with your audience.",
    icon: <VideoCameraOutlined />,
  },
  {
    heading: "Engage with Fans",
    description:
      "Receive comments and likes to interact with your fans and build a community.",
    icon: <CommentOutlined />,
  },
  {
    heading: "Connect with Musicians",
    description:
      "Find and connect with other artists to collaborate and grow together.",
    icon: <UsergroupAddOutlined />,
  },
  {
    heading: "Discover New Talent",
    description:
      "Use our discover page to find artists in your region and expand your network.",
    icon: <EditOutlined />,
  },
  {
    heading: "AI Music Generator",
    description:
      "Overcome creative blocks with our AI-powered music generator.",
    icon: <EditOutlined />,
  },
  {
    heading: "Promote on Instagram",
    description:
      "Integrate with Instagram and run ads from Google Ads to reach a wider audience.",
    icon: <InstagramOutlined />,
  },
];

const testimonials = [
  {
    name: "John Doe",
    designation: "Singer-Songwriter",
    content:
      "This app has transformed my music career. I’ve connected with amazing artists and my fanbase has grown significantly!",
    avatar: "/random-user/5.jpg",
  },
  {
    name: "Jane Smith",
    designation: "Guitarist",
    content:
      "The AI music generator is a game-changer. It’s helped me overcome creative blocks and produce new music effortlessly.",
    avatar: "/random-user/6.jpg",
  },
  {
    name: "Mike Johnson",
    designation: "Drummer",
    content:
      "I’ve found so many talented musicians to collaborate with. This app is a must-have for any serious artist.",
    avatar: "/random-user/7.jpg",
  },
  {
    name: "Emily Davis",
    designation: "Vocalist",
    content:
      "The integration with Instagram has boosted my online presence. I’m reaching more fans than ever before!",
    avatar: "/random-user/12.jpg",
  },
  {
    name: "Chris Lee",
    designation: "Producer",
    content:
      "Running ads from Google Ads directly through the app has made promoting my music so much easier.",
    avatar: "/random-user/17.jpg",
  },
  {
    name: "Sara Wilson",
    designation: "Pianist",
    content:
      "I love the smooth animations and user-friendly interface. It makes using the app a delightful experience.",
    avatar: "/random-user/27.jpg",
  },
];

const navItems = [
  {
    name: "Home",
    link: "/",

  },
  {
    name: "Features",
    link: "#features",

  },
  {
    name: "FAQs",
    link: "#faq",

  },
];

const packages = [
  {
    title: "Basic",
    description: "For aspiring musicians looking to get started.",
    monthly: 9,
    yearly: 69,
    features: ["Post images and videos", "Receive comments and likes"],
  },
  {
    title: "Pro",
    description:
      "For serious artists ready to take their career to the next level.",
    monthly: 19,
    yearly: 149,
    features: [
      "All Basic features",
      "AI music generator",
      "Instagram integration",
    ],
    highlight: true,
  },
  {
    title: "Enterprise",
    description: "For established musicians and bands.",
    monthly: 29,
    yearly: 249,
    features: [
      "All Pro features",
      "Run ads from Google Ads",
      "Advanced analytics",
    ],
  },
];

const questionAnswers = [
  {
    question: "How can I connect with other musicians?",
    answer:
      "Use our discover page to find and connect with artists in your region based on genre and instruments.",
  },
  {
    question: "What is the AI music generator?",
    answer:
      "It’s a tool that helps you overcome creative blocks by generating music ideas for you.",
  },
  {
    question: "Can I promote my music on social media?",
    answer:
      "Yes, you can integrate with Instagram and run ads from Google Ads directly through the app.",
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes, we offer a 14-day free trial for all our plans.",
  },
];

const logos = [
  { url: "/company-logo/afwBIFK.png" },
  { url: "/company-logo/LlloOPa.png" },
  { url: "/company-logo/j8jPb4H.png" },
  { url: "/company-logo/mJ1sZFv.png" },
];

const steps = [
  {
    heading: "Sign Up",
    description: "Create your account and set up your profile.",
  },
  {
    heading: "Post Your Music",
    description: "Share your images and videos to showcase your talent.",
  },
  {
    heading: "Engage and Connect",
    description:
      "Receive feedback, connect with other artists, and grow your network.",
  },
  {
    heading: "Promote and Grow",
    description:
      "Use our tools to promote your music and reach a wider audience.",
  },
];

const painPoints = [
  {
    emoji: "😞",
    title: "Struggling to Gain Exposure",
  },
  {
    emoji: "🤝",
    title: "Difficult to Connect with Other Artists",
  },
  {
    emoji: "😩",
    title: "Creative Blocks",
  },
];

const avatarItems = [
  {
    src: "/random-user/51.jpg",
  },
  {
    src: "/random-user/9.jpg",
  },
  {
    src: "/random-user/52.jpg",
  },
  {
    src: "/random-user/5.jpg",
  },
  {
    src: "/random-user/12.jpg",
  },
];

export default function LandingPage() {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis();

 
    // Use requestAnimationFrame to continuously update the scroll
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  return (
    <LandingContainer >
      <FloatingNav navItems={navItems} />
      <div className="">
        <LandingHero />
      </div>
      <div>
        <LandingHowItWorks />
      </div>
      <div>
        <LandingFeatures
          id="features"
          title="Achieve Your Musical Dreams"
          subtitle="Our Features Help You Shine"
          features={features}
        />
      </div>
      {/* <div
             >
        <LandingTestimonials
          title="Success Stories"
          subtitle="See How We've Helped Musicians Like You"
          testimonials={testimonials}
        />
      </div> */}
      {/* <div
        
      >
        <LandingPricing
          id="pricing"
          title="Choose Your Plan"
          subtitle="Affordable Plans to Suit Your Needs"
          packages={packages}
        />
      </div> */}
      <div>
        <LandingFAQ
          id="faq"
          title="Frequently Asked Questions"
          subtitle="Got Questions? We've Got Answers"
          questionAnswers={questionAnswers}
        />
      </div>
      <div>
        <LandingCTA
          title="Ready to Elevate Your Music Career?"
          subtitle="Join Our Community of Talented Musicians"
          buttonText="Get Started"
          buttonLink="/signup"
        />
      </div>
    </LandingContainer>
  );
}
