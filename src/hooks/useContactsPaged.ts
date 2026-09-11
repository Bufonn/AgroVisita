import { useState, useCallback, useRef, useEffect } from 'react';
import { buscarContatosPagina, type ContatoResumido } from '../services/contactsService';

export function useContactsPaged(pageSize = 50) {
  const [contatos, setContatos] = useState<ContatoResumido[]>([]);
  const [busca, setBusca] = useState('');
  const [carregandoPrimeira, setCarregandoPrimeira] = useState(false);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [fim, setFim] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const offsetRef = useRef(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const buscaRef = useRef('');

  const carregarPrimeiraPagina = useCallback(async (termo: string) => {
    setCarregandoPrimeira(true);
    setErro(null);
    setFim(false);
    offsetRef.current = 0;
    buscaRef.current = termo;
    try {
      const resultado = await buscarContatosPagina(termo, 0, pageSize);
      setContatos(resultado.contatos);
      setTotal(resultado.total);
      offsetRef.current = resultado.contatos.length;
      setFim(resultado.contatos.length < pageSize);
    } catch {
      setErro('Erro ao carregar contatos');
    } finally {
      setCarregandoPrimeira(false);
    }
  }, [pageSize]);

  const carregarMais = useCallback(async () => {
    if (carregandoMais || fim || carregandoPrimeira) return;
    setCarregandoMais(true);
    try {
      const resultado = await buscarContatosPagina(buscaRef.current, offsetRef.current, pageSize);
      setContatos(prev => [...prev, ...resultado.contatos]);
      offsetRef.current += resultado.contatos.length;
      setFim(resultado.contatos.length < pageSize);
    } catch {
      setErro('Erro ao carregar mais contatos');
    } finally {
      setCarregandoMais(false);
    }
  }, [carregandoMais, fim, carregandoPrimeira, pageSize]);

  const mudarBusca = useCallback((termo: string) => {
    setBusca(termo);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      carregarPrimeiraPagina(termo);
    }, 300);
  }, [carregarPrimeiraPagina]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return {
    contatos,
    busca,
    carregandoPrimeira,
    carregandoMais,
    fim,
    erro,
    total,
    mudarBusca,
    carregarPrimeiraPagina,
    carregarMais,
  };
}
