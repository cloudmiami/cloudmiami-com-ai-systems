-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    company TEXT,
    website TEXT,
    interests TEXT[], -- ['web', 'seo', 'video', 'content', 'automation']
    status TEXT DEFAULT 'new', -- 'new', 'contacted', 'qualified', 'booked', 'lost'
    notes TEXT,
    source TEXT DEFAULT 'chatbot'
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    messages JSONB NOT NULL DEFAULT '[]',
    metadata JSONB DEFAULT '{}'
);

-- Create meetings table
CREATE TABLE IF NOT EXISTS meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    cal_com_event_id TEXT,
    scheduled_at TIMESTAMPTZ,
    status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled', 'completed'
    meeting_url TEXT,
    notes TEXT
);

-- Create knowledge base table for RAG
CREATE TABLE IF NOT EXISTS knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT, -- 'services', 'pricing', 'process', 'about', 'faq'
    metadata JSONB DEFAULT '{}',
    embedding VECTOR(1536)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_conversations_lead_id ON conversations(lead_id);
CREATE INDEX IF NOT EXISTS idx_meetings_lead_id ON meetings(lead_id);
CREATE INDEX IF NOT EXISTS idx_meetings_scheduled_at ON meetings(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_category ON knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_embedding ON knowledge_base USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust as needed for your security requirements)
CREATE POLICY "Allow public access for leads" ON leads FOR SELECT USING (true);
CREATE POLICY "Allow authenticated inserts for leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated updates for leads" ON leads FOR UPDATE USING (true);

CREATE POLICY "Allow public access for conversations" ON conversations FOR SELECT USING (true);
CREATE POLICY "Allow authenticated inserts for conversations" ON conversations FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public access for meetings" ON meetings FOR SELECT USING (true);
CREATE POLICY "Allow authenticated inserts for meetings" ON meetings FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public access for knowledge_base" ON knowledge_base FOR SELECT USING (true);
CREATE POLICY "Allow authenticated inserts for knowledge_base" ON knowledge_base FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated updates for knowledge_base" ON knowledge_base FOR UPDATE USING (auth.role() = 'authenticated');

-- Insert sample knowledge base content
INSERT INTO knowledge_base (title, content, category) VALUES
('Cloud Miami Services Overview', 'Cloud Miami is an AI-Native B2B agency specializing in three core services: 1) Web Architecture - building modern, high-performance websites using React, Next.js, and AI-powered optimization. 2) SEO/GEO - search engine optimization with a focus on geographic SEO and AI-driven content strategies. 3) Video Production - professional video content for marketing, product demos, and social media.', 'services'),
('Web Architecture Services', 'Our web architecture services include: Modern frontend development with React and Next.js, Server-side rendering for SEO, API integration and backend development, Database design and optimization, Performance optimization and Core Web Vitals improvement, CI/CD pipeline setup, Hosting and deployment on cloud infrastructure.', 'services'),
('SEO and GEO Services', 'Our SEO/GEO services include: Keyword research and strategy, On-page SEO optimization, Technical SEO audits, Content strategy and creation, Local SEO and Google Business Profile optimization, Geographic SEO for Miami-based businesses, AI-powered content optimization, Schema markup and structured data, Link building and authority building.', 'services'),
('Video Production Services', 'Our video production services include: Product demo videos, Explainer videos, Social media content, Interview and testimonial videos, Webinar recording and editing, Motion graphics and animations, Video SEO optimization, YouTube channel optimization.', 'services'),
('Discovery Process', 'Our process is simple: 1) Discovery Call - We discuss your business goals, challenges, and requirements. 2) Strategy & Proposal - We create a customized plan with timeline and pricing. 3) Development - We build your solution with regular updates and feedback cycles. 4) Launch & Support - We deploy and provide ongoing support.', 'process'),
('Pricing Structure', 'Our pricing varies by project scope: Web Architecture projects typically range from $5,000 to $25,000 depending on complexity. SEO/GEO packages start at $2,000/month for ongoing services. Video production starts at $1,500 per video. We offer custom quotes for enterprise projects. Contact us for a free discovery call to get an exact quote.', 'pricing'),
('Cloud Miami About Us', 'Cloud Miami was founded to help B2B businesses leverage AI and modern technology to scale efficiently. We are a team of developers, designers, and marketers passionate about helping businesses grow through technology. Our approach is partnership-based - we become an extension of your team.', 'about'),
('Why Choose Cloud Miami', 'We stand out because: 1) AI-Native approach - We build AI into everything we do. 2) B2B Focus - We understand the unique challenges of B2B businesses. 3) End-to-End - We handle everything from strategy to deployment. 4) Transparent Communication - Regular updates and clear timelines. 5) Ongoing Support - We are here for you long after launch.', 'about'),
('Typical Timeline', 'Timelines vary by project: Simple website: 2-4 weeks. Complex web application: 6-12 weeks. SEO campaigns: 3-6 months for significant results. Video production: 1-2 weeks per video. We provide detailed timelines in our proposals and keep you updated throughout the process.', 'process'),
('AI Capabilities', 'As an AI-Native agency, we leverage AI for: AI-powered chatbots and customer support, Content generation and optimization, Predictive analytics, Automation workflows, Personalization engines, Voice interfaces, Image and video generation assistance.', 'about'),
('Contact Information', 'You can reach us by: Email: hello@cloudmiami.com, Website: cloudmiami.com, Scheduling: meet.cloudmiami.com. We typically respond within 24 hours on business days.', 'about'),
('Industries We Serve', 'We work with B2B businesses across various industries: Technology and SaaS, Professional Services (law firms, accountants, consultants), Healthcare and medical practices, Real estate and construction, Financial services, E-commerce and retail, Manufacturing and logistics.', 'about'),
('FAQ - Are we ready for AI', 'Many business owners wonder if they are ready for AI adoption. The answer is usually yes. We start small and scale based on your needs. AI integration can begin with simple tools like chatbots and progress to more complex automation. We guide you through every step.', 'faq'),
('FAQ - How do we measure success', 'We define clear KPIs at the start of each project. For websites: traffic, conversion rates, load times. For SEO: search rankings, organic traffic, lead generation. For video: views, engagement, conversion impact. We provide regular reports and adjust strategies based on data.', 'faq');
