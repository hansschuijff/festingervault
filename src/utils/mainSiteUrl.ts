export default function mainSiteUrl(path, params={}) {
  const base = new URL(path, window.MAIN_SITE_URL);
	const param=new URLSearchParams(params)
	base.search=param.toString();
  return base.toString();
}
