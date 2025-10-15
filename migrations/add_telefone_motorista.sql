-- Adicionar campo telefone na tabela motoristas
ALTER TABLE motoristas ADD COLUMN IF NOT EXISTS telefone VARCHAR(20);

-- Comentário descritivo
COMMENT ON COLUMN motoristas.telefone IS 'Telefone de contato do motorista';
