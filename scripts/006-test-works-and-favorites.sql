-- Création de la table des favoris
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    work_id UUID NOT NULL REFERENCES works(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, work_id)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_work_id ON favorites(work_id);

-- RLS pour les favoris
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Politique: Les utilisateurs peuvent voir leurs propres favoris
CREATE POLICY "Users can view their own favorites"
    ON favorites FOR SELECT
    USING (auth.uid() = user_id);

-- Politique: Les utilisateurs peuvent ajouter leurs propres favoris
CREATE POLICY "Users can add their own favorites"
    ON favorites FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Politique: Les utilisateurs peuvent supprimer leurs propres favoris
CREATE POLICY "Users can delete their own favorites"
    ON favorites FOR DELETE
    USING (auth.uid() = user_id);

-- Insertion d'œuvres de test (uniquement si elles n'existent pas)
-- Note: Vous devrez remplacer 'USER_ID_HERE' par un vrai ID de profil
DO $$
DECLARE
    test_user_id UUID;
    literature_id UUID;
    sciences_id UUID;
    tech_id UUID;
    work1_id UUID;
    work2_id UUID;
    work3_id UUID;
    work4_id UUID;
BEGIN
    -- Récupérer un utilisateur existant (le premier avec le rôle member ou librarian)
    SELECT id INTO test_user_id FROM profiles WHERE role IN ('member', 'librarian') LIMIT 1;
    
    -- Si aucun utilisateur n'existe, sortir
    IF test_user_id IS NULL THEN
        RAISE NOTICE 'Aucun utilisateur trouvé. Veuillez créer un compte d''abord.';
        RETURN;
    END IF;

    -- Récupérer les IDs des catégories
    SELECT id INTO literature_id FROM categories WHERE name = 'Littérature' LIMIT 1;
    SELECT id INTO sciences_id FROM categories WHERE name = 'Sciences' LIMIT 1;
    SELECT id INTO tech_id FROM categories WHERE name = 'Technologies' LIMIT 1;

    -- Œuvre 1: Le Petit Prince
    INSERT INTO works (
        title, 
        author, 
        description, 
        type, 
        submitted_by,
        status,
        approved_at,
        isbn,
        publication_year,
        publisher,
        cover_url
    ) VALUES (
        'Le Petit Prince',
        'Antoine de Saint-Exupéry',
        'Un conte poétique et philosophique sous l''apparence d''un conte pour enfants. L''histoire d''un petit prince qui voyage de planète en planète et rencontre des personnages étranges.',
        'book',
        test_user_id,
        'approved',
        NOW(),
        '978-2-07-061275-8',
        1943,
        'Gallimard',
        '/placeholder.svg?height=400&width=300'
    ) RETURNING id INTO work1_id;

    -- Associer la catégorie Littérature
    IF literature_id IS NOT NULL THEN
        INSERT INTO work_categories (work_id, category_id) VALUES (work1_id, literature_id);
    END IF;

    -- Œuvre 2: Une brève histoire du temps
    INSERT INTO works (
        title, 
        author, 
        description, 
        type, 
        submitted_by,
        status,
        approved_at,
        isbn,
        publication_year,
        publisher,
        cover_url
    ) VALUES (
        'Une brève histoire du temps',
        'Stephen Hawking',
        'Du big bang aux trous noirs, Stephen Hawking explique de manière accessible les concepts les plus complexes de la physique moderne.',
        'book',
        test_user_id,
        'approved',
        NOW(),
        '978-2-08-081238-4',
        1988,
        'Flammarion',
        '/placeholder.svg?height=400&width=300'
    ) RETURNING id INTO work2_id;

    -- Associer la catégorie Sciences
    IF sciences_id IS NOT NULL THEN
        INSERT INTO work_categories (work_id, category_id) VALUES (work2_id, sciences_id);
    END IF;

    -- Œuvre 3: Clean Code
    INSERT INTO works (
        title, 
        author, 
        description, 
        type, 
        submitted_by,
        status,
        approved_at,
        isbn,
        publication_year,
        publisher,
        cover_url
    ) VALUES (
        'Clean Code: A Handbook of Agile Software Craftsmanship',
        'Robert C. Martin',
        'Un guide complet sur l''art d''écrire du code propre, maintenable et élégant. Un incontournable pour tout développeur professionnel.',
        'book',
        test_user_id,
        'approved',
        NOW(),
        '978-0-13-235088-4',
        2008,
        'Prentice Hall',
        '/placeholder.svg?height=400&width=300'
    ) RETURNING id INTO work3_id;

    -- Associer la catégorie Technologies
    IF tech_id IS NOT NULL THEN
        INSERT INTO work_categories (work_id, category_id) VALUES (work3_id, tech_id);
    END IF;

    -- Œuvre 4: 1984
    INSERT INTO works (
        title, 
        author, 
        description, 
        type, 
        submitted_by,
        status,
        approved_at,
        isbn,
        publication_year,
        publisher,
        cover_url
    ) VALUES (
        '1984',
        'George Orwell',
        'Un roman dystopique qui dépeint une société totalitaire où la surveillance est omniprésente et où la liberté de pensée est réprimée.',
        'book',
        test_user_id,
        'approved',
        NOW(),
        '978-2-07-036822-8',
        1949,
        'Gallimard',
        '/placeholder.svg?height=400&width=300'
    ) RETURNING id INTO work4_id;

    -- Associer la catégorie Littérature
    IF literature_id IS NOT NULL THEN
        INSERT INTO work_categories (work_id, category_id) VALUES (work4_id, literature_id);
    END IF;

    RAISE NOTICE 'Œuvres de test créées avec succès!';
END $$;
