-- ═══════════════════════════════════════════════════════════════════════════════════════
-- CENTRAL MEGA DA VIRADA — tabela de sincronização (mesmo modelo do MAPACOT: id + dados)
-- Onde rodar: painel do Supabase → SQL Editor → colar tudo → Run. Uma vez só.
-- O que faz: cria a tabela "megavirada", onde o aplicativo guarda o histórico de sorteios,
-- os lotes de jogos e as configurações, para o celular e o notebook verem a mesma coisa.
-- Não altera nem apaga nada do MAPACOT. Pode rodar de novo sem perder dados.
-- ═══════════════════════════════════════════════════════════════════════════════════════
create table if not exists megavirada (
  id            text primary key,
  dados         jsonb not null,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- A data da última gravação é sempre a do servidor (não depende do relógio de cada aparelho).
-- É por ela que um aparelho percebe o que mudou no outro.
create or replace function megavirada_carimbar()
returns trigger language plpgsql as $$
begin
  new.atualizado_em := clock_timestamp();
  if tg_op = 'UPDATE' then new.criado_em := old.criado_em; end if;
  return new;
end $$;

create or replace trigger megavirada_carimbo
  before insert or update on megavirada
  for each row execute function megavirada_carimbar();

-- Acesso pela chave pública do projeto, como nas tabelas do MAPACOT.
alter table megavirada enable row level security;
do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'megavirada' and policyname = 'megavirada_acesso') then
    create policy megavirada_acesso on megavirada for all to anon, authenticated using (true) with check (true);
  end if;
end $$;
grant select, insert, update, delete on megavirada to anon, authenticated;

-- Avisa a API do Supabase que a tabela existe (ela passa a responder na hora).
notify pgrst, 'reload schema';
