import { LinkedinFilled, TwitterCircleFilled, ArrowUpOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { Logo } from '../Logo';

interface Props extends HTMLAttributes<HTMLElement> {}

export const LandingFooter: React.FC<Props> = ({ ...props }) => {
  const socials = [
    {
      name: 'X',
      icon: <TwitterCircleFilled />,
      link: 'https://twitter.com/',
    },
    {
      name: 'LinkedIn',
      icon: <LinkedinFilled />,
      link: 'https://linkedin.com/',
    },
  ];

  // Smooth scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative mt-16" {...props}>
      <div className="bg-muted border-neutral-100 dark:border-neutral-800 px-8 pt-16 pb-20 relative bg-white dark:bg-muted bg-opacity-65">
        <div className="max-w-7xl mt-10 mx-auto flex gap-y-5 flex-col sm:flex-row justify-between items-center">
          {/* Logo and Rights */}
          <div className="text-center sm:text-left mb-6 sm:mb-0">
            <div className="mr-4 mb-4">

            </div>
            <div>Copyright &copy; 2024</div>
            <div className="mt-2">All rights reserved</div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col sm:flex-row items-center gap-10">
            {socials.map((link) => (
              <Link
                key={link.name}
                className="transition-colors text-xs sm:text-sm hover:text-blue-500 text-neutral-600 dark:text-neutral-300"
                href={link.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.icon} {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Running Text Animation at the Top */}
        <motion.div
          className="absolute inset-x-0 top-0 scrollbar-hide w-full flex justify-center items-center py-3"
          animate={{ x: ['100%', '-100%'] }} // Infinite horizontal scrolling
          transition={{
            repeat: Infinity,
            duration: 10, // Slow down the animation
            ease: 'linear',
          }}
        >
          <div className="whitespace-nowrap  text-white font-extrabold w-full text-5xl tracking-widest">
            OUTSOUND MUSIC CO. 
          </div>
        </motion.div>

        {/* Back to Top Button */}
        <motion.div
          className="absolute bottom-10 right-10  text-white p-4 rounded-full cursor-pointer shadow-lg hover:bg-blue-600"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
        >
          <ArrowUpOutlined className="text-xl" />
        </motion.div>
      </div>
    </div>
  );
};

export default LandingFooter;
