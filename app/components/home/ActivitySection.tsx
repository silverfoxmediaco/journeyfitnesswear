import {Link} from 'react-router';
import {motion} from 'framer-motion';

const ACTIVITY_CATEGORIES = [
  {
    title: 'Gym',
    description: 'Built for the iron',
    image: '/images/activity-gym.webp',
    link: '/collections',
  },
  {
    title: 'Running',
    description: 'Engineered for speed',
    image: '/images/activity-running.webp',
    link: '/collections',
  },
  {
    title: 'Yoga',
    description: 'Flow with freedom',
    image: '/images/activity-yoga.webp',
    link: '/collections',
  },
  {
    title: 'Streetwear',
    description: 'Rep the journey anywhere',
    image: '/images/activity-streetwear.webp',
    link: '/collections',
  },
];

export function ActivitySection() {
  return (
    <section className="jfw-activity-section py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-14"
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, margin: '-100px'}}
          transition={{duration: 0.6, ease: 'easeOut'}}
        >
          <div className="w-12 h-[2px] bg-jfw-blue mx-auto mb-6" />
          <h2 className="jfw-activity-heading font-heading text-3xl md:text-4xl lg:text-5xl uppercase tracking-[0.15em] text-gray-900">
            What&apos;s Your <span className="text-jfw-blue">Journey</span>?
          </h2>
        </motion.div>

        {/* Activity Tiles Grid */}
        <div className="jfw-activity-grid grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {ACTIVITY_CATEGORIES.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{opacity: 0, y: 30}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, margin: '-50px'}}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: 'easeOut',
              }}
            >
              <Link
                to={category.link}
                prefetch="intent"
                className="jfw-activity-tile group relative block aspect-[3/4] rounded-lg overflow-hidden"
              >
                {/* Background Image or Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                  <h3 className="jfw-activity-title font-heading text-base md:text-lg uppercase tracking-[0.15em] text-white group-hover:text-jfw-blue transition-colors duration-300">
                    {category.title}
                  </h3>
                  <p className="jfw-activity-desc font-body text-xs text-gray-300 mt-1">
                    {category.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
