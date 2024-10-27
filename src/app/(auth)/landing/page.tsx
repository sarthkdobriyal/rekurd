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
    heading: "Share Your Art and Vision",
    description: "Showcase your talent with interactive features. Let your music speak to your local community and eventually a global one.",
    icon: "VideoCameraOutlined",
    color: "black",
    url: "/share",
    src: "/recording-studio-night.jpg"
  },
  {
    heading: "Engage with Fans",
    description: "Build your following through likes, comments, and direct interactions. Connect with your audience on a deeper level.",
    icon: "CommentOutlined",
    color: "blue",
    url: "/engage",
    src: "/fans.jpeg"
  },
  {
    heading: "Connect with Musicians",
    description: "Find the perfect collaborators, teachers,  or bandmates. Grow together in the world of music.",
    icon: "UsergroupAddOutlined",
    color: "green",
    url: "/connect",
    src: "/jam-night.jpg"
  },
  {
    heading: "Discover Local Talent",
    description: "Explore and directly support regional and local artists, expand your network, and find the next big thing in your local music scene.",
    icon: "SearchOutlined",
    color: "purple",
    url: "/discover",
    src: "/opn-mic.jpg"
  },
  {
    heading: "Promote on Social Media",
    description: "Reach wider audiences through integrated marketing. Seamlessly share your content and run targeted ads.",
    icon: "InstagramOutlined",
    color: "pink",
    url: "/promote",
    src: "/share-music.jpg"
  },
  {
    heading: "AI Support",
    description: "Break through creative blocks with our AI-powered tools. Generate melodies, chord progressions, and more with our AI powered tools",
    icon: "BulbOutlined",
    color: "orange",
    url: "/ai-generator",
    src: "/ai-music.jpg"
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
      "Connecting with musicians is simple! Just hit the connect button on any user’s profile. Once they accept your request, you can start chatting with them.",
  },
  {
    question: "What is the gig hunting feature, and how does it work?",
    answer:
      "Gig hunting allows anyone to post gigs like performances or services needed, such as a music producer or mixing/mastering artist. Musicians can apply for these gigs, and the poster chooses who to connect with. This feature is coming soon!",
  },
  {
    question: "How do I submit my song to the radio?",
    answer:
      "On the radio page, you'll find a 'Submit Song' button. Just click it, and you're ready to share your music!",
  },
  {
    question: "Can non-musicians use this platform?",
    answer:
      "Absolutely! Non-musicians can discover new music, find local artists, attend events, or even search for music teachers to start their own musical journey.",
  },
  {
    question: "How can I create my profile as a musician?",
    answer:
      "Once you sign up, you'll be guided through an easy onboarding process to set up your profile. Afterward, you can always edit it from your user profile page.",
  },
  {
    question: "Can I filter musicians based on the genre or instruments they play?",
    answer:
      "Yes! Use the filters on the Discover tab or the search bar to find musicians by genre, instrument, and more.",
  },
  {
    question: "How can I find music teachers or students?",
    answer:
      "Head over to the Discover tab, apply the filters to search for either music teachers or students, and you're good to go!",
  },
  {
    question: "Can local businesses post gig opportunities?",
    answer:
      "Yes, businesses can post gigs for musicians! This feature is currently under development, so stay tuned.",
  },
  {
    question: "How does the location-based search work?",
    answer:
      "When you visit the Discover tab, you’ll see musicians in your area. It’s all about connecting with local talent!",
  },
  {
    question: "Is there a way to promote local talent through the radio?",
    answer:
      "Yes! You can submit your song to the radio, and once reviewed, it will be played. Listeners can support you by donating. This feature is coming soon!",
  },
];

const logos = [
  { url: "/company-logo/afwBIFK.png" },
  { url: "/company-logo/LlloOPa.png" },
  { url: "/company-logo/j8jPb4H.png" },
  { url: "/company-logo/mJ1sZFv.png" },
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

        <LandingHero />

        <LandingHowItWorks />

        <LandingFeatures
          features={features}
        />
      

        <LandingCTA
          title="Ready to Elevate Your Music Career?"
          subtitle="Join Our Community of Talented Musicians"
          buttonText="Get Started"
          buttonLink="/signup"
        />


        <LandingFAQ
          id="faq"
          title="Frequently Asked Questions"
          subtitle="Got Questions? We've Got Answers"
          questionAnswers={questionAnswers}
        />
    </LandingContainer>
  );
}
