import type {Route} from './+types/pages.size-guide';
import {Link} from 'react-router';
import {useState} from 'react';
import {Ruler, HelpCircle, ArrowRight} from 'lucide-react';

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'Journey Fitness Wear | Size Guide'},
    {
      name: 'description',
      content:
        'Find your perfect fit with our comprehensive size guide for t-shirts, tank tops, hoodies, and joggers.',
    },
  ];
};

export default function SizeGuidePage() {
  return (
    <div className="jfw-size-guide-page">
      <SizeGuideHero />
      <SizeGuideTables />
      <HowToMeasure />
      <NeedHelpCTA />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Hero
   ───────────────────────────────────────────── */
function SizeGuideHero() {
  return (
    <section className="jfw-size-guide-hero relative w-full py-20 md:py-28 flex items-center justify-center overflow-hidden bg-jfw-dark">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-jfw-blue/5 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 text-center px-4 sm:px-6">
        <div className="w-16 h-[2px] bg-jfw-blue mx-auto mb-8" />
        <h1 className="jfw-size-guide-heading font-heading text-4xl sm:text-5xl md:text-6xl uppercase tracking-[0.15em] text-jfw-white leading-tight mb-4">
          Size <span className="text-jfw-blue">Guide</span>
        </h1>
        <p className="font-body text-base sm:text-lg text-gray-400 max-w-xl mx-auto">
          Find your perfect fit across all our performance apparel.
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Size Chart Tables
   ───────────────────────────────────────────── */
type Gender = 'mens' | 'womens';
type MeasureUnit = 'inches' | 'cm';

const MENS_TSHIRTS = {
  headers: ['Size', 'Chest', 'Length', 'Sleeve'],
  inches: [
    ['S', '34–36', '28', '15.5'],
    ['M', '38–40', '29', '17'],
    ['L', '42–44', '30', '18.5'],
    ['XL', '46–48', '31', '20'],
    ['2XL', '50–52', '32', '21.5'],
    ['3XL', '54–56', '33', '23'],
  ],
  cm: [
    ['S', '86–91', '71', '39'],
    ['M', '97–102', '74', '43'],
    ['L', '107–112', '76', '47'],
    ['XL', '117–122', '79', '51'],
    ['2XL', '127–132', '81', '55'],
    ['3XL', '137–142', '84', '58'],
  ],
};

const MENS_TANK_TOPS = {
  headers: ['Size', 'Chest', 'Length'],
  inches: [
    ['S', '34–36', '27'],
    ['M', '38–40', '28'],
    ['L', '42–44', '29'],
    ['XL', '46–48', '30'],
    ['2XL', '50–52', '31'],
  ],
  cm: [
    ['S', '86–91', '69'],
    ['M', '97–102', '71'],
    ['L', '107–112', '74'],
    ['XL', '117–122', '76'],
    ['2XL', '127–132', '79'],
  ],
};

const MENS_HOODIES = {
  headers: ['Size', 'Chest', 'Length', 'Sleeve'],
  inches: [
    ['S', '34–36', '27', '33.5'],
    ['M', '38–40', '28', '34.5'],
    ['L', '42–44', '29', '35.5'],
    ['XL', '46–48', '30', '36.5'],
    ['2XL', '50–52', '31', '37.5'],
    ['3XL', '54–56', '32', '38.5'],
  ],
  cm: [
    ['S', '86–91', '69', '85'],
    ['M', '97–102', '71', '88'],
    ['L', '107–112', '74', '90'],
    ['XL', '117–122', '76', '93'],
    ['2XL', '127–132', '79', '95'],
    ['3XL', '137–142', '81', '98'],
  ],
};

const MENS_JOGGERS = {
  headers: ['Size', 'Waist', 'Hip', 'Inseam'],
  inches: [
    ['S', '28–30', '36–38', '29'],
    ['M', '31–33', '39–41', '30'],
    ['L', '34–36', '42–44', '31'],
    ['XL', '37–40', '45–48', '31.5'],
    ['2XL', '41–44', '49–52', '32'],
  ],
  cm: [
    ['S', '71–76', '91–97', '74'],
    ['M', '79–84', '99–104', '76'],
    ['L', '86–91', '107–112', '79'],
    ['XL', '94–102', '114–122', '80'],
    ['2XL', '104–112', '124–132', '81'],
  ],
};

const WOMENS_TSHIRTS = {
  headers: ['Size', 'Chest', 'Length', 'Sleeve'],
  inches: [
    ['S', '31–33', '25.5', '7'],
    ['M', '34–36', '26.5', '7.5'],
    ['L', '37–39', '27.5', '8'],
    ['XL', '40–43', '28.5', '8.5'],
    ['2XL', '44–47', '29.5', '9'],
  ],
  cm: [
    ['S', '79–84', '65', '18'],
    ['M', '86–91', '67', '19'],
    ['L', '94–99', '70', '20'],
    ['XL', '102–109', '72', '22'],
    ['2XL', '112–119', '75', '23'],
  ],
};

const WOMENS_TANK_TOPS = {
  headers: ['Size', 'Chest', 'Length'],
  inches: [
    ['S', '31–33', '25'],
    ['M', '34–36', '25.5'],
    ['L', '37–39', '26'],
    ['XL', '40–43', '27'],
    ['2XL', '44–47', '28'],
  ],
  cm: [
    ['S', '79–84', '64'],
    ['M', '86–91', '65'],
    ['L', '94–99', '66'],
    ['XL', '102–109', '69'],
    ['2XL', '112–119', '71'],
  ],
};

const WOMENS_HOODIES = {
  headers: ['Size', 'Chest', 'Length', 'Sleeve'],
  inches: [
    ['S', '34–36', '25', '31'],
    ['M', '38–40', '26', '32'],
    ['L', '42–44', '27', '33'],
    ['XL', '46–48', '28', '34'],
    ['2XL', '50–52', '29', '35'],
  ],
  cm: [
    ['S', '86–91', '64', '79'],
    ['M', '97–102', '66', '81'],
    ['L', '107–112', '69', '84'],
    ['XL', '117–122', '71', '86'],
    ['2XL', '127–132', '74', '89'],
  ],
};

const WOMENS_JOGGERS = {
  headers: ['Size', 'Waist', 'Hip', 'Inseam'],
  inches: [
    ['S', '25–27', '35–37', '28'],
    ['M', '28–30', '38–40', '28.5'],
    ['L', '31–33', '41–43', '29'],
    ['XL', '34–37', '44–47', '29.5'],
    ['2XL', '38–41', '48–51', '30'],
  ],
  cm: [
    ['S', '64–69', '89–94', '71'],
    ['M', '71–76', '97–102', '72'],
    ['L', '79–84', '104–109', '74'],
    ['XL', '86–94', '112–119', '75'],
    ['2XL', '97–104', '122–130', '76'],
  ],
};

const CHARTS: Record<
  Gender,
  {label: string; data: {headers: string[]; inches: string[][]; cm: string[][]}}[]
> = {
  mens: [
    {label: 'T-Shirts', data: MENS_TSHIRTS},
    {label: 'Tank Tops', data: MENS_TANK_TOPS},
    {label: 'Hoodies', data: MENS_HOODIES},
    {label: 'Joggers', data: MENS_JOGGERS},
  ],
  womens: [
    {label: 'T-Shirts', data: WOMENS_TSHIRTS},
    {label: 'Tank Tops', data: WOMENS_TANK_TOPS},
    {label: 'Hoodies', data: WOMENS_HOODIES},
    {label: 'Joggers', data: WOMENS_JOGGERS},
  ],
};

function SizeGuideTables() {
  const [gender, setGender] = useState<Gender>('mens');
  const [unit, setUnit] = useState<MeasureUnit>('inches');

  return (
    <section className="jfw-size-guide-tables py-16 md:py-24 bg-jfw-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Controls */}
        <div className="jfw-size-guide-controls flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          {/* Gender Tabs */}
          <div className="jfw-size-guide-tabs flex rounded-lg overflow-hidden border border-jfw-gray" role="tablist" aria-label="Gender selection">
            <button
              role="tab"
              aria-selected={gender === 'mens'}
              aria-controls="size-panel-mens"
              id="size-tab-mens"
              onClick={() => setGender('mens')}
              className={`jfw-size-tab px-6 py-2.5 font-heading text-xs uppercase tracking-[0.2em] transition-all duration-200 ${
                gender === 'mens'
                  ? 'bg-jfw-blue text-jfw-black'
                  : 'bg-jfw-dark text-gray-400 hover:text-jfw-white'
              }`}
            >
              Men&apos;s
            </button>
            <button
              role="tab"
              aria-selected={gender === 'womens'}
              aria-controls="size-panel-womens"
              id="size-tab-womens"
              onClick={() => setGender('womens')}
              className={`jfw-size-tab px-6 py-2.5 font-heading text-xs uppercase tracking-[0.2em] transition-all duration-200 ${
                gender === 'womens'
                  ? 'bg-jfw-blue text-jfw-black'
                  : 'bg-jfw-dark text-gray-400 hover:text-jfw-white'
              }`}
            >
              Women&apos;s
            </button>
          </div>

          {/* Unit Toggle */}
          <div className="jfw-size-unit-toggle flex rounded-lg overflow-hidden border border-jfw-gray">
            <button
              onClick={() => setUnit('inches')}
              className={`jfw-unit-btn px-4 py-2.5 font-body text-xs uppercase tracking-wider transition-all duration-200 ${
                unit === 'inches'
                  ? 'bg-jfw-blue text-jfw-black'
                  : 'bg-jfw-dark text-gray-400 hover:text-jfw-white'
              }`}
            >
              Inches
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`jfw-unit-btn px-4 py-2.5 font-body text-xs uppercase tracking-wider transition-all duration-200 ${
                unit === 'cm'
                  ? 'bg-jfw-blue text-jfw-black'
                  : 'bg-jfw-dark text-gray-400 hover:text-jfw-white'
              }`}
            >
              CM
            </button>
          </div>
        </div>

        {/* Tables */}
        <div
          role="tabpanel"
          id={`size-panel-${gender}`}
          aria-labelledby={`size-tab-${gender}`}
          className="jfw-size-guide-panels space-y-10"
        >
          {CHARTS[gender].map((chart) => (
            <div key={chart.label} className="jfw-size-chart">
              <h3 className="font-heading text-base md:text-lg uppercase tracking-[0.15em] text-jfw-white mb-4">
                {chart.label}
              </h3>
              <div className="overflow-x-auto rounded-lg border border-jfw-gray">
                <table className="jfw-size-table w-full text-left">
                  <thead>
                    <tr className="bg-jfw-blue/10">
                      {chart.data.headers.map((header) => (
                        <th
                          key={header}
                          className="px-4 py-3 font-heading text-[10px] uppercase tracking-[0.2em] text-jfw-blue border-b border-jfw-gray whitespace-nowrap"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {chart.data[unit].map((row, i) => (
                      <tr
                        key={row[0]}
                        className={`${
                          i % 2 === 0 ? 'bg-jfw-dark' : 'bg-jfw-black'
                        } border-b border-jfw-gray/50 last:border-b-0`}
                      >
                        {row.map((cell, j) => (
                          <td
                            key={`${row[0]}-${j}`}
                            className={`px-4 py-3 font-body text-sm whitespace-nowrap ${
                              j === 0
                                ? 'text-jfw-white font-medium'
                                : 'text-gray-400'
                            }`}
                          >
                            {cell}
                            {j > 0 && (
                              <span className="text-gray-600 ml-0.5">
                                {unit === 'inches' ? '"' : ' cm'}
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   How to Measure
   ───────────────────────────────────────────── */
const MEASUREMENTS = [
  {
    label: 'Chest',
    instruction:
      'Measure around the fullest part of your chest, keeping the tape level under your arms.',
  },
  {
    label: 'Waist',
    instruction:
      'Measure around your natural waistline, keeping the tape comfortably loose.',
  },
  {
    label: 'Hip',
    instruction:
      'Measure around the fullest part of your hips, keeping the tape level.',
  },
  {
    label: 'Inseam',
    instruction:
      'Measure from the crotch seam to the bottom of the leg on a pair of well-fitting pants.',
  },
  {
    label: 'Sleeve',
    instruction:
      'Measure from the center back of your neck, across your shoulder, and down to your wrist.',
  },
];

function HowToMeasure() {
  return (
    <section className="jfw-how-to-measure py-16 md:py-24 bg-jfw-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-14 h-14 rounded-full bg-jfw-blue/10 flex items-center justify-center mx-auto mb-6">
            <Ruler size={24} className="text-jfw-blue" />
          </div>
          <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-[0.15em] text-jfw-white mb-3">
            How to <span className="text-jfw-blue">Measure</span>
          </h2>
          <p className="font-body text-sm text-gray-400 max-w-lg mx-auto">
            For the most accurate fit, use a soft measuring tape and measure
            over light clothing or bare skin.
          </p>
        </div>

        <div className="jfw-measure-list space-y-4">
          {MEASUREMENTS.map((m) => (
            <div
              key={m.label}
              className="jfw-measure-item flex gap-4 p-4 md:p-5 bg-jfw-black border border-jfw-gray rounded-xl"
            >
              <span className="font-heading text-xs uppercase tracking-[0.2em] text-jfw-blue min-w-[80px] pt-0.5">
                {m.label}
              </span>
              <p className="font-body text-sm text-gray-400 leading-relaxed">
                {m.instruction}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Need Help CTA
   ───────────────────────────────────────────── */
function NeedHelpCTA() {
  return (
    <section className="jfw-size-guide-cta py-16 md:py-20 bg-jfw-black">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <div className="w-14 h-14 rounded-full bg-jfw-blue/10 flex items-center justify-center mx-auto mb-6">
          <HelpCircle size={24} className="text-jfw-blue" />
        </div>
        <h2 className="font-heading text-xl md:text-2xl uppercase tracking-[0.15em] text-jfw-white mb-3">
          Need Help Finding Your Size?
        </h2>
        <p className="font-body text-sm text-gray-400 mb-8">
          Our team is here to help. Reach out and we&apos;ll make sure you get
          the perfect fit.
        </p>
        <Link
          to="/pages/contact"
          prefetch="intent"
          className="jfw-size-guide-contact-btn inline-flex items-center gap-3 bg-jfw-blue hover:bg-jfw-blue-dark text-jfw-black font-heading text-sm uppercase tracking-[0.2em] px-10 py-4 rounded-lg transition-all duration-300 hover:shadow-jfw-glow-lg hover:scale-105"
        >
          Contact Us
          <ArrowRight size={18} strokeWidth={2.5} />
        </Link>
      </div>
    </section>
  );
}
