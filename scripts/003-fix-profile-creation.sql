-- Ajout d'une politique pour permettre au trigger de créer les profils
-- sans session active (nécessaire pendant le signup)

-- Supprimer l'ancienne policy restrictive si elle existe
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Politique qui permet l'insertion de profil par le trigger système
-- security definer permet au trigger d'insérer malgré RLS
CREATE POLICY "Allow profile creation during signup"
    ON profiles FOR INSERT
    WITH CHECK (true);

-- Alternative: si vous voulez que seuls les utilisateurs authentifiés puissent créer leur profil
-- (décommentez ceci et supprimez la politique ci-dessus si nécessaire)
-- CREATE POLICY "Users can insert own profile"
--     ON profiles FOR INSERT
--     WITH CHECK (auth.uid() = id);
