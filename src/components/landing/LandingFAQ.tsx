import { ArrowRightOutlined } from '@ant-design/icons';
import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Props extends HTMLAttributes<HTMLElement> {
  title: string;
  subtitle: string;
  questionAnswers: { question: string; answer: string }[];
}

export const LandingFAQ: React.FC<Props> = ({
  title,
  subtitle,
  questionAnswers,
  className,
  ...props
}) => {
  return (
    <section id="faq" className={cn('py-16 px-6 lg:px-12 min-h-screen font-sans', className)}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-y-16">
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-4xl lg:text-5xl lg:max-w-[80%] font-bold tracking-tight leading-tight text-slate-800 dark:text-white">
              {title}
            </h3>
            <p className="text-sm md:text-lg lg:text-xl mt-6 text-slate-600 dark:text-slate-400">
              {subtitle}
            </p>
          </motion.div>

          <motion.div
            className="w-full md:w-1/2 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-6">
              {questionAnswers.map((item, index) => (
                <motion.div
                  key={index}
                  className="py-5"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <details className="group">
                    <summary className="flex justify-between text-base md:text-xl items-center font-semibold cursor-pointer list-none">
                      <span>{item.question}</span>
                      <motion.span
                        className="transition-transform group-open:rotate-180"
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 0 }} // Start at 0
                        transition={{ duration: 0.3 }}
                      >
                        <ArrowRightOutlined className="transform transition-transform group-open:rotate-90" />
                      </motion.span>
                    </summary>
                    <motion.div
                      className="overflow-hidden"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                    >
                      <p className="text-slate-600 font-poppins dark:text-slate-400 mt-3 text-sm lg:text-lg">
                        {item.answer}
                      </p>
                    </motion.div>
                  </details>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LandingFAQ;
