import getFilePostfix from './getFilePostfix'
import tenantConfig from "../getTenantConfig";

const FILE_THUMBS = {};
FILE_THUMBS.default = tenantConfig.value("fileThumbsDefault");
FILE_THUMBS.ai   = tenantConfig.value("fileThumbsAi");
FILE_THUMBS.doc  = tenantConfig.value("fileThumbsDoc");
FILE_THUMBS.gif  = tenantConfig.value("fileThumbsGif");
FILE_THUMBS.jpeg = tenantConfig.value("fileThumbsJpeg");
FILE_THUMBS.jpg  = tenantConfig.value("fileThumbsJpg");
FILE_THUMBS.page = tenantConfig.value("fileThumbsPage");
FILE_THUMBS.pdf  = tenantConfig.value("fileThumbsPdf");
FILE_THUMBS.png  = tenantConfig.value("fileThumbsPng");
FILE_THUMBS.ps   = tenantConfig.value("fileThumbsPs");
FILE_THUMBS.xls  = tenantConfig.value("fileThumbsXls");

/** @module getFileThumb */

/**
 * 获取文件类型的缩略图
 * @param file { File|string } 文件或者文件名
 * @return {string} 返回值
 */
export default function getFileThumb(file) {
  return FILE_THUMBS[getFilePostfix(file)] || FILE_THUMBS.default;
}
