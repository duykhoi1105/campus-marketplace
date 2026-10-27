import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import {
  COMPRESSION_CONFIG,
  calculateCompressionRatio,
  calculateTargetDimensions,
} from '@/constants/compression';

export { COMPRESSION_CONFIG, calculateCompressionRatio, calculateTargetDimensions };

export interface CompressionResult {
  uri: string;
  width: number;
  height: number;
  originalSizeBytes: number;
  compressedSizeBytes: number;
  compressionRatioPercent: number;
  base64?: string;
  processingTimeMs: number;
}

/**
 * Ước lượng hoặc tính dung lượng file ảnh từ URI hoặc base64
 */
export async function getApproximateFileSize(uri: string, base64?: string): Promise<number> {
  if (base64) {
    return Math.round((base64.length * 3) / 4);
  }

  if (Platform.OS === 'web' && uri.startsWith('data:')) {
    const parts = uri.split(',');
    if (parts.length === 2) {
      return Math.round((parts[1].length * 3) / 4);
    }
  }

  try {
    const res = await fetch(uri);
    const blob = await res.blob();
    return blob.size;
  } catch {
    return 2450000;
  }
}

/**
 * Xử lý nén và co dãn ảnh trước khi upload
 * TUÂN THỦ ĐỀ CƯƠNG: Nén trực tiếp tại máy client trước khi gửi lên API
 */
export async function compressAndResizeImage(
  pickerAsset: ImagePicker.ImagePickerAsset
): Promise<CompressionResult> {
  const startTime = Date.now();

  const originalWidth = pickerAsset.width || 1200;
  const originalHeight = pickerAsset.height || 1200;
  const originalSize = pickerAsset.fileSize || (await getApproximateFileSize(pickerAsset.uri));

  const targetDim = calculateTargetDimensions(originalWidth, originalHeight);

  // Thực hiện resize và nén qua ImageManipulator
  const manipulationResult = await ImageManipulator.manipulateAsync(
    pickerAsset.uri,
    [{ resize: { width: targetDim.width, height: targetDim.height } }],
    {
      compress: COMPRESSION_CONFIG.JPEG_QUALITY,
      format: ImageManipulator.SaveFormat.JPEG,
      base64: true,
    }
  );

  const processingTimeMs = Date.now() - startTime;
  const compressedSize = await getApproximateFileSize(
    manipulationResult.uri,
    manipulationResult.base64
  );

  const ratio = calculateCompressionRatio(originalSize, compressedSize);

  return {
    uri: manipulationResult.uri,
    width: manipulationResult.width,
    height: manipulationResult.height,
    originalSizeBytes: originalSize,
    compressedSizeBytes: compressedSize,
    compressionRatioPercent: ratio,
    base64: manipulationResult.base64
      ? `data:image/jpeg;base64,${manipulationResult.base64}`
      : undefined,
    processingTimeMs,
  };
}

/**
 * Chụp ảnh từ camera
 */
export async function takePhotoWithCamera(): Promise<CompressionResult | null> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Ứng dụng cần quyền sử dụng máy ảnh để chụp hình sản phẩm.');
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (result.canceled || !result.assets || !result.assets[0]) {
    return null;
  }

  return await compressAndResizeImage(result.assets[0]);
}

/**
 * Chọn ảnh từ thư viện
 */
export async function pickImageFromLibrary(): Promise<CompressionResult | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Ứng dụng cần quyền truy cập thư viện ảnh để chọn hình sản phẩm.');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (result.canceled || !result.assets || !result.assets[0]) {
    return null;
  }

  return await compressAndResizeImage(result.assets[0]);
}
