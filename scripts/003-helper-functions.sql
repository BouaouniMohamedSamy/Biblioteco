-- Fonction pour incrémenter un compteur de manière atomique
CREATE OR REPLACE FUNCTION increment(
    table_name TEXT,
    row_id UUID,
    column_name TEXT
)
RETURNS VOID AS $$
BEGIN
    EXECUTE format('UPDATE %I SET %I = %I + 1 WHERE id = $1', table_name, column_name, column_name)
    USING row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour incrémenter les vues
CREATE OR REPLACE FUNCTION increment_views(work_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE works SET views_count = views_count + 1 WHERE id = work_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour incrémenter les téléchargements
CREATE OR REPLACE FUNCTION increment_downloads(work_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE works SET downloads_count = downloads_count + 1 WHERE id = work_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
