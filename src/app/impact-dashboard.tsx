'use client';

import { AnimatedCard, AnimatedStatBox } from './animations';

export default function DashboardPage() {
  const metrics = [
    { label: 'Total Donations', value: '$127,450', color: '#2BA5D7' },
    { label: 'Active Volunteers', value: '342', color: '#7CB342' },
    { label: 'Beneficiaries', value: '8,943', color: '#1E5A96' },
    { label: 'Programs Running', value: '18', color: '#2BA5D7' },
  ];

  const programs = [
    { name: 'Student Education (India)', progress: 85, raised: '$45,200', goal: '$50,000' },
    { name: 'Senior Nutrition', progress: 72, raised: '$38,500', goal: '$52,000' },
    { name: 'Women Wellness', progress: 68, raised: '$28,900', goal: '$42,000' },
    { name: 'Healthcare Access', progress: 90, raised: '$14,850', goal: '$16,500' },
  ];

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-[#E8F4F8] to-[#F0F8E8]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-black text-[#1E5A96] mb-6">Impact Dashboard</h1>
          <p className="text-xl text-gray-700 max-w-2xl">
            Real-time tracking of our programs, donations, and lives changed.
          </p>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-[#1E5A96] mb-12">Key Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {metrics.map((metric, idx) => (
              <AnimatedStatBox key={idx} value={metric.value} label={metric.label} color={metric.color} />
            ))}
          </div>
        </div>
      </section>

      {/* Program Progress */}
      <section className="py-16 px-4 sm:px-6 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-[#1E5A96] mb-12">Program Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programs.map((program, idx) => (
              <AnimatedCard key={idx} delay={idx * 0.1}>
                <div className="bg-white p-8 rounded-xl">
                  <h3 className="text-xl font-black text-[#1E5A96] mb-4">{program.name}</h3>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-bold text-[#7CB342]">{program.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-[#7CB342] h-3 rounded-full transition-all duration-500"
                        style={{ width: `${program.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Raised: {program.raised}</span>
                    <span className="font-bold text-[#1E5A96]">Goal: {program.goal}</span>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
