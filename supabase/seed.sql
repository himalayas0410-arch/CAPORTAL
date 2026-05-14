-- Seed Data for GSTverify Portal

-- Seed Subscription Plans
INSERT INTO public.subscription_plans (name, slug, price, validity_days, description, features, max_simultaneous_users)
VALUES 
('Basic', 'basic', 499, 30, 'Perfect for small firms with low volume needs.', 
 '{\"records\": 1000, \"support\": \"email\", \"api_access\": false}', 1),
('Professional', 'professional', 1499, 30, 'Best for established CA firms and growing teams.', 
 '{\"records\": 10000, \"support\": \"priority\", \"api_access\": true}', 3),
('Enterprise', 'enterprise', 4999, 90, 'High volume processing for large enterprises.', 
 '{\"records\": \"unlimited\", \"support\": \"dedicated\", \"api_access\": true}', 10)
ON CONFLICT (slug) DO UPDATE 
SET name = EXCLUDED.name,
    price = EXCLUDED.price,
    validity_days = EXCLUDED.validity_days,
    description = EXCLUDED.description,
    features = EXCLUDED.features,
    max_simultaneous_users = EXCLUDED.max_simultaneous_users;
