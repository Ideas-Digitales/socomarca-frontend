export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { fetchGetTermsAndConditions } from '@/services/actions/terminos-condiciones.actions';

export default async function TerminoCondicionesPage() {
  const { ok, data } = await fetchGetTermsAndConditions();

  const html = ok && data?.content ? data.content : null;

  return (
    <div className="bg-[#f1f5f9] min-h-screen p-6 md:p-12">
      <div className="max-w-4xl mx-auto bg-white pt-0 shadow">
        <div className="w-full flex">
          <div className="h-2 w-1/3 bg-[#267E00]"></div>
          <div className="h-2 w-2/3 bg-[#6CB409]"></div>
        </div>

        {html ? (
          <section className="px-8 pb-8 prose prose-sm max-w-none mt-8">
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </section>
        ) : (
          <section className="px-8 pb-8">
            <p>No fue posible cargar los términos y condiciones en este momento.</p>
          </section>
        )}
      </div>
    </div>
  );
}
