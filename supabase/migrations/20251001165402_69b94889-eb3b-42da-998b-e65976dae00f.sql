-- Fix search_path for existing get_relationships_with_labels function
CREATE OR REPLACE FUNCTION public.get_relationships_with_labels()
RETURNS TABLE(relationship_id uuid, relation_type text, source_label text, source_type text, target_label text, target_type text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    r.id as relationship_id,
    r.relation_type,
    s.label as source_label,
    s.node_type as source_type,
    t.label as target_label,
    t.node_type as target_type
  FROM public.relationships r
  JOIN public.nodes s ON r.source_id = s.id
  JOIN public.nodes t ON r.target_id = t.id;
$$;