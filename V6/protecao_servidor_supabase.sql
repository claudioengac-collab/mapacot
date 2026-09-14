-- ═══════════════════════════════════════════════════════════════════════════════════════
-- MAPACOT — PROTEÇÃO EXTRA NO PRÓPRIO SERVIDOR (opcional, recomendada)
-- Onde rodar: painel do Supabase → SQL Editor → colar tudo → Run
-- O que faz: impede que a linha "vendedores" (e, por segurança, a "global") seja gravada
-- com ZERO vendedores/formas de pagamento quando a versão anterior tinha 2 ou mais.
-- É a única proteção que funciona contra QUALQUER cliente, até código que ainda nem existe.
-- Não altera nada do uso normal (excluir um por um continua funcionando).
-- ═══════════════════════════════════════════════════════════════════════════════════════
create or replace function mapacot_bloquear_apagao_vendedores()
returns trigger language plpgsql as $$
declare
  vend_antes int; vend_depois int; pag_antes int; pag_depois int;
begin
  if new.id not in ('vendedores', 'global') then return new; end if;
  vend_antes  := coalesce((select count(*) from jsonb_object_keys(coalesce(old.dados->'fornecedorVendedor', '{}'::jsonb))), 0);
  vend_depois := coalesce((select count(*) from jsonb_object_keys(coalesce(new.dados->'fornecedorVendedor', '{}'::jsonb))), 0);
  pag_antes   := coalesce((select count(*) from jsonb_object_keys(coalesce(old.dados->'fornecedorFormasPagamento', '{}'::jsonb))), 0);
  pag_depois  := coalesce((select count(*) from jsonb_object_keys(coalesce(new.dados->'fornecedorFormasPagamento', '{}'::jsonb))), 0);
  -- Só bloqueia na linha "vendedores": na "global", os campos foram REMOVIDOS de propósito
  -- pela versão nova do app (migraram para "vendedores"), então lá zerar é esperado.
  if new.id = 'vendedores' and ((vend_antes >= 2 and vend_depois = 0) or (pag_antes >= 2 and pag_depois = 0)) then
    raise exception 'MAPACOT: gravação recusada — ia zerar % vendedor(es) e % forma(s) de pagamento de uma vez (trava anti-apagão no servidor).', vend_antes, pag_antes;
  end if;
  return new;
end $$;

drop trigger if exists mapacot_trava_vendedores on cadastros;
create trigger mapacot_trava_vendedores
  before update on cadastros
  for each row execute function mapacot_bloquear_apagao_vendedores();
