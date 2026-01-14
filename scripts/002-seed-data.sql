-- Insertion des catégories par défaut
INSERT INTO categories (name, description) VALUES
    ('Sciences', 'Ouvrages scientifiques et techniques'),
    ('Littérature', 'Romans, poésie, théâtre'),
    ('Histoire', 'Livres et documents historiques'),
    ('Philosophie', 'Essais et traités philosophiques'),
    ('Arts', 'Beaux-arts, musique, cinéma'),
    ('Technologies', 'Informatique, ingénierie, innovation'),
    ('Éducation', 'Pédagogie et manuels scolaires'),
    ('Société', 'Sciences sociales et humaines')
ON CONFLICT (name) DO NOTHING;

-- Profil bibliothécaire par défaut (à utiliser après création d'un compte)
-- Note: L'utilisateur doit d'abord créer un compte via l'interface
-- Ensuite, vous pouvez promouvoir un utilisateur en bibliothécaire avec:
-- UPDATE profiles SET role = 'librarian' WHERE email = 'admin@library.com';
