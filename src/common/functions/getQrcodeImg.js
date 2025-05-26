import tenantConfig from "../getTenantConfig";

export default function getQrcodeImg(data, imgW=240, imgH=240) {
  return `${tenantConfig.value("apiOrigin")}/general/public/resource/qrcode?w=${imgW}&h=${imgH}&data=${encodeURIComponent(data)}`;
}