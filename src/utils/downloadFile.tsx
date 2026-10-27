// downloadFile.ts
import RNFS from 'react-native-fs';
import { Platform, PermissionsAndroid } from 'react-native';

interface DownloadOptions {
  url: string;
  fileName: string;
}

export const downloadFile = async ({
  url,
  fileName,
}: DownloadOptions): Promise<string | null> => {
  try {
    if (!url) {
      throw new Error('Download URL is required');
    }

    // Request storage permission on older Android versions
    if (
      Platform.OS === 'android' &&
      Number(Platform.Version) < 29
    ) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        throw new Error('Storage permission denied');
      }
    }

    // Android: Downloads folder
    // iOS: App's Documents folder
    const downloadPath =
      Platform.OS === 'android'
        ? RNFS.DownloadDirectoryPath
        : RNFS.DocumentDirectoryPath;

    const destinationPath = `${downloadPath}/${fileName}`;

    const result = await RNFS.downloadFile({
      fromUrl: url,
      toFile: destinationPath,
      background: true,
      discretionary: true,
    }).promise;

    if (result.statusCode >= 200 && result.statusCode < 300) {
      console.log('File downloaded successfully:', destinationPath);
      return destinationPath;
    }

    // Remove incomplete download
    if (await RNFS.exists(destinationPath)) {
      await RNFS.unlink(destinationPath);
    }

    throw new Error(`Download failed. Status: ${result.statusCode}`);
  } catch (error) {
    console.error('File download error:', error);
    throw error;
  }
};