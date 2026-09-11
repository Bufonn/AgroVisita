import * as Contacts from 'expo-contacts';

const FIELDS = [Contacts.ContactField.FULL_NAME, Contacts.ContactField.PHONES] as const;

export interface ContatoResumido {
  id: string;
  nome: string;
  telefone: string | null;
}

export async function buscarContatosPagina(
  termo: string,
  pageOffset: number,
  pageSize = 50
): Promise<{ contatos: ContatoResumido[]; total: number }> {
  const details = await Contacts.Contact.getAllDetails(FIELDS, {
    limit: pageSize,
    offset: pageOffset,
    name: termo || undefined,
    sortOrder: Contacts.ContactsSortOrder.GivenName,
  });
  const total = await Contacts.Contact.getCount();
  const contatos = details.map(item => ({
    id: item.id,
    nome: item.fullName ?? 'Sem nome',
    telefone: item.phones?.[0]?.number ?? null,
  }));
  return { contatos, total };
}
