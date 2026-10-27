import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useAppTheme } from '@/hooks/useThemeColor';
import { ApiService } from '@/services/api';
import { CATEGORIES, MarketCategory } from '@/types/marketplace';
import {
  pickImageFromLibrary,
  takePhotoWithCamera,
  CompressionResult,
} from '@/utils/imageCompression';
import { useAuthStore } from '@/store/useAuthStore';
import { Spacing, BorderRadius, Typography, TouchTarget } from '@/constants/layout';

export default function ListingFormModal() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const queryClient = useQueryClient();
  const currentUser = useAuthStore(state => state.user);
  const switchRole = useAuthStore(state => state.switchRole);

  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const isEditing = Boolean(editId);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<MarketCategory>('textbooks');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('1');
  const [condition, setCondition] = useState<'new' | 'like-new' | 'used'>('used');
  const [photoUri, setPhotoUri] = useState<string>('');
  const [compressionInfo, setCompressionInfo] = useState<CompressionResult | null>(null);

  // Trạng thái xử lý
  const [isLoadingExisting, setIsLoadingExisting] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 1. Nếu là chế độ sửa, tải dữ liệu cũ lên form
  useEffect(() => {
    let isMounted = true;
    if (isEditing && editId) {
      ApiService.getListingById(editId)
        .then(existing => {
          if (!isMounted) return;
          setTitle(existing.title);
          setDescription(existing.description);
          setCategory(existing.category);
          setPrice(String(existing.price));
          setStock(String(existing.stock));
          setCondition(existing.condition || 'used');
          setPhotoUri(existing.photoUri);
        })
        .catch(() => {
          if (!isMounted) return;
          Alert.alert('Lỗi', 'Không thể tải thông tin tin đăng để chỉnh sửa.');
          router.back();
        })
        .finally(() => {
          if (isMounted) {
            setIsLoadingExisting(false);
          }
        });
    }
    return () => {
      isMounted = false;
    };
  }, [isEditing, editId, router]);

  // 2. Xử lý chụp ảnh và nén
  const handleTakePhoto = async () => {
    try {
      setIsCompressing(true);
      const result = await takePhotoWithCamera();
      if (result) {
        setPhotoUri(result.base64 || result.uri);
        setCompressionInfo(result);
        setErrors(prev => ({ ...prev, photo: '' }));
      }
    } catch (e: any) {
      Alert.alert('Lỗi máy ảnh', e.message || 'Không thể chụp ảnh.');
    } finally {
      setIsCompressing(false);
    }
  };

  // 3. Xử lý chọn ảnh từ thư viện và nén
  const handlePickPhoto = async () => {
    try {
      setIsCompressing(true);
      const result = await pickImageFromLibrary();
      if (result) {
        setPhotoUri(result.base64 || result.uri);
        setCompressionInfo(result);
        setErrors(prev => ({ ...prev, photo: '' }));
      }
    } catch (e: any) {
      Alert.alert('Lỗi thư viện ảnh', e.message || 'Không thể chọn ảnh.');
    } finally {
      setIsCompressing(false);
    }
  };

  // 4. Kiểm tra hợp lệ đầu vào (Validation)
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Vui lòng nhập tiêu đề tin đăng.';
    } else if (title.trim().length < 5) {
      newErrors.title = 'Tiêu đề quá ngắn (tối thiểu 5 ký tự).';
    }

    if (!photoUri) {
      newErrors.photo = 'Bắt buộc phải có ít nhất một ảnh sản phẩm.';
    }

    const numPrice = Number(price);
    if (!price || isNaN(numPrice) || numPrice < 0) {
      newErrors.price = 'Giá bán phải là số hợp lệ không âm (VNĐ).';
    }

    const numStock = parseInt(stock, 10);
    if (!stock || isNaN(numStock) || numStock < 0) {
      newErrors.stock = 'Tồn kho phải là số nguyên không âm.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 5. Submit Form
  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Thông tin chưa hợp lệ', 'Vui lòng kiểm tra lại các trường có thông báo lỗi.');
      return;
    }

    // Đảm bảo vai trò SELLER khi đăng tin
    if (currentUser?.role !== 'SELLER') {
      await switchRole('SELLER');
    }

    setIsSubmitting(true);
    try {
      let finalPhotoUrl = photoUri;

      // Nếu có chuỗi base64 nén, upload lên server
      if (compressionInfo?.base64) {
        const uploadResult = await ApiService.uploadImage(compressionInfo.base64);
        finalPhotoUrl = uploadResult.url;
      }

      if (isEditing && editId) {
        // Cập nhật
        await ApiService.updateListing(editId, {
          title: title.trim(),
          description: description.trim(),
          category,
          price: Number(price),
          stock: parseInt(stock, 10),
          condition,
          photoUri: finalPhotoUrl,
        });
        Alert.alert('Thành công', 'Đã cập nhật tin đăng thành công!');
      } else {
        // Tạo mới
        await ApiService.createListing({
          sellerId: currentUser?.id || 'USR-02',
          sellerName: currentUser?.name || 'Duy Khôi (Sinh Viên Bán Hàng)',
          sellerPhone: currentUser?.phone || '0912345678',
          title: title.trim(),
          description: description.trim(),
          category,
          price: Number(price),
          stock: parseInt(stock, 10),
          photoUri: finalPhotoUrl,
          originalPhotoSize: compressionInfo?.originalSizeBytes,
          compressedPhotoSize: compressionInfo?.compressedSizeBytes,
          condition,
        });
        Alert.alert('Thành công', 'Tin đăng đã được xuất bản lên Chợ Sinh Viên!');
      }

      // Invalidate queries để màn hình chính tải dữ liệu mới
      queryClient.invalidateQueries({ queryKey: ['campus-listings-1923050528'] });
      router.back();
    } catch (error: any) {
      Alert.alert('Lỗi đăng tin', error.message || 'Không thể lưu tin đăng.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingExisting) {
    return (
      <View style={[styles.loadingCenter, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
        <Text style={[Typography.body, { color: colors.textSecondary, marginTop: Spacing.md }]}>
          Đang nạp dữ liệu tin đăng cũ...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Tiêu đề modal */}
      <Text style={[styles.pageTitle, Typography.heading, { color: colors.textPrimary }]}>
        {isEditing ? 'Chỉnh sửa tin đăng' : 'Đăng tin bán đồ / giáo trình'}
      </Text>
      <Text style={[Typography.bodySmall, { color: colors.textSecondary, marginBottom: Spacing.lg }]}>
        Khuôn viên Trường Đại học Công nghệ Đồng Nai
      </Text>

      {/* 1. KHU VỰC HÌNH ẢNH & NÉN ẢNH */}
      <View
        style={[
          styles.sectionBox,
          { backgroundColor: colors.backgroundCard, borderColor: colors.borderDefault },
        ]}
      >
        <Text style={[styles.sectionLabel, Typography.title, { color: colors.textPrimary }]}>
          1. Ảnh sản phẩm <Text style={{ color: colors.danger }}>*</Text>
        </Text>

        {photoUri ? (
          <View style={styles.previewWrapper}>
            <Image
              source={{ uri: photoUri }}
              style={styles.previewImage}
              contentFit="cover"
              accessibilityLabel="Ảnh xem trước sản phẩm"
            />
            {compressionInfo ? (
              <View
                style={[
                  styles.compressionBanner,
                  { backgroundColor: colors.successBg, borderColor: colors.success },
                ]}
              >
                <Text style={[Typography.caption, { color: colors.success, fontWeight: '700' }]}>
                  ✓ Đã nén thành công trước khi gửi:
                </Text>
                <Text style={[Typography.caption, { color: colors.textSecondary }]}>
                  {(compressionInfo.originalSizeBytes / 1024).toFixed(0)} KB →{' '}
                  {(compressionInfo.compressedSizeBytes / 1024).toFixed(0)} KB (Giảm{' '}
                  {compressionInfo.compressionRatioPercent}%) trong{' '}
                  {compressionInfo.processingTimeMs}ms
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}

        <View style={styles.photoActions}>
          <TouchableOpacity
            style={[
              styles.photoBtn,
              { backgroundColor: colors.tintSubtle, borderColor: colors.tint },
            ]}
            onPress={handleTakePhoto}
            disabled={isCompressing}
            accessibilityRole="button"
            accessibilityLabel="Chụp ảnh mới bằng camera"
          >
            <Text style={{ fontSize: 18 }}>📸</Text>
            <Text style={[styles.photoBtnText, Typography.bodySmall, { color: colors.tint }]}>
              {photoUri ? 'Chụp lại ảnh' : 'Chụp ảnh mới'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.photoBtn,
              { backgroundColor: colors.backgroundSecondary, borderColor: colors.borderDefault },
            ]}
            onPress={handlePickPhoto}
            disabled={isCompressing}
            accessibilityRole="button"
            accessibilityLabel="Chọn ảnh từ thư viện máy"
          >
            <Text style={{ fontSize: 18 }}>🖼️</Text>
            <Text style={[styles.photoBtnText, Typography.bodySmall, { color: colors.textPrimary }]}>
              Chọn từ thư viện
            </Text>
          </TouchableOpacity>
        </View>

        {isCompressing ? (
          <View style={styles.compressingRow}>
            <ActivityIndicator size="small" color={colors.tint} />
            <Text style={[Typography.caption, { color: colors.tint, marginLeft: Spacing.xs }]}>
              Đang tối ưu và nén ảnh (JPEG 63%)...
            </Text>
          </View>
        ) : null}

        {errors.photo ? (
          <Text style={[styles.errorText, Typography.caption, { color: colors.danger }]}>
            {errors.photo}
          </Text>
        ) : null}
      </View>

      {/* 2. TIÊU ĐỀ & MÔ TẢ */}
      <View
        style={[
          styles.sectionBox,
          { backgroundColor: colors.backgroundCard, borderColor: colors.borderDefault },
        ]}
      >
        <Text style={[styles.sectionLabel, Typography.title, { color: colors.textPrimary }]}>
          2. Thông tin món đồ
        </Text>

        <Text style={[styles.inputLabel, Typography.bodySmall, { color: colors.textSecondary }]}>
          Tiêu đề tin đăng <Text style={{ color: colors.danger }}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.textInput,
            Typography.body,
            {
              backgroundColor: colors.backgroundInput,
              borderColor: errors.title ? colors.danger : colors.borderDefault,
              color: colors.textPrimary,
            },
          ]}
          value={title}
          onChangeText={setTitle}
          placeholder="Ví dụ: Giáo trình Cấu trúc dữ liệu & Giải thuật..."
          placeholderTextColor={colors.textMuted}
          accessibilityLabel="Nhập tiêu đề tin đăng"
        />
        {errors.title ? (
          <Text style={[styles.errorText, Typography.caption, { color: colors.danger }]}>
            {errors.title}
          </Text>
        ) : null}

        <Text
          style={[
            styles.inputLabel,
            Typography.bodySmall,
            { color: colors.textSecondary, marginTop: Spacing.md },
          ]}
        >
          Danh mục sản phẩm <Text style={{ color: colors.danger }}>*</Text>
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
          {CATEGORIES.map(cat => {
            const isSelected = category === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.catChip,
                  {
                    backgroundColor: isSelected ? colors.tint : colors.backgroundSecondary,
                    borderColor: isSelected ? colors.tint : colors.borderDefault,
                  },
                ]}
                onPress={() => setCategory(cat.id)}
                accessibilityRole="button"
                accessibilityLabel={`Chọn danh mục ${cat.name}`}
              >
                <Text
                  style={[
                    styles.catChipText,
                    Typography.caption,
                    {
                      color: isSelected ? colors.onTint : colors.textPrimary,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text
          style={[
            styles.inputLabel,
            Typography.bodySmall,
            { color: colors.textSecondary, marginTop: Spacing.md },
          ]}
        >
          Tình trạng món đồ
        </Text>
        <View style={styles.conditionRow}>
          {[
            { id: 'used', label: 'Đã qua sử dụng' },
            { id: 'like-new', label: 'Như mới (95%)' },
            { id: 'new', label: 'Mới 100%' },
          ].map(c => (
            <TouchableOpacity
              key={c.id}
              style={[
                styles.conditionBtn,
                {
                  backgroundColor: condition === c.id ? colors.tint : colors.backgroundSecondary,
                  borderColor: condition === c.id ? colors.tint : colors.borderDefault,
                },
              ]}
              onPress={() => setCondition(c.id as any)}
            >
              <Text
                style={[
                  Typography.caption,
                  {
                    color: condition === c.id ? colors.onTint : colors.textPrimary,
                    fontWeight: condition === c.id ? '700' : '500',
                  },
                ]}
              >
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text
          style={[
            styles.inputLabel,
            Typography.bodySmall,
            { color: colors.textSecondary, marginTop: Spacing.md },
          ]}
        >
          Mô tả chi tiết
        </Text>
        <TextInput
          style={[
            styles.textArea,
            Typography.body,
            {
              backgroundColor: colors.backgroundInput,
              borderColor: colors.borderDefault,
              color: colors.textPrimary,
            },
          ]}
          value={description}
          onChangeText={setDescription}
          placeholder="Mô tả nguồn gốc, hiện trạng, địa điểm hẹn xem trong trường..."
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={4}
          accessibilityLabel="Nhập mô tả chi tiết sản phẩm"
        />
      </View>

      {/* 3. GIÁ & TỒN KHO */}
      <View
        style={[
          styles.sectionBox,
          { backgroundColor: colors.backgroundCard, borderColor: colors.borderDefault },
        ]}
      >
        <Text style={[styles.sectionLabel, Typography.title, { color: colors.textPrimary }]}>
          3. Giá bán & Tồn kho
        </Text>

        <View style={styles.priceStockRow}>
          <View style={styles.colHalf}>
            <Text style={[styles.inputLabel, Typography.bodySmall, { color: colors.textSecondary }]}>
              Giá bán (VNĐ) <Text style={{ color: colors.danger }}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.textInput,
                Typography.body,
                {
                  backgroundColor: colors.backgroundInput,
                  borderColor: errors.price ? colors.danger : colors.borderDefault,
                  color: colors.textPrimary,
                },
              ]}
              value={price}
              onChangeText={setPrice}
              placeholder="Ví dụ: 45000"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
              accessibilityLabel="Nhập giá bán bằng đồng"
            />
            {errors.price ? (
              <Text style={[styles.errorText, Typography.caption, { color: colors.danger }]}>
                {errors.price}
              </Text>
            ) : null}
          </View>

          <View style={styles.colHalf}>
            <Text style={[styles.inputLabel, Typography.bodySmall, { color: colors.textSecondary }]}>
              Số lượng tồn <Text style={{ color: colors.danger }}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.textInput,
                Typography.body,
                {
                  backgroundColor: colors.backgroundInput,
                  borderColor: errors.stock ? colors.danger : colors.borderDefault,
                  color: colors.textPrimary,
                },
              ]}
              value={stock}
              onChangeText={setStock}
              placeholder="1"
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
              accessibilityLabel="Nhập số lượng tồn kho"
            />
            {errors.stock ? (
              <Text style={[styles.errorText, Typography.caption, { color: colors.danger }]}>
                {errors.stock}
              </Text>
            ) : null}
          </View>
        </View>
      </View>

      {/* Nút gửi form */}
      <TouchableOpacity
        style={[
          styles.submitBtn,
          { backgroundColor: colors.tint },
        ]}
        onPress={handleSubmit}
        disabled={isSubmitting || isCompressing}
        accessibilityRole="button"
        accessibilityLabel={isEditing ? 'Lưu thay đổi tin đăng' : 'Đăng tin lên chợ'}
      >
        {isSubmitting ? (
          <ActivityIndicator color={colors.onTint} />
        ) : (
          <Text style={[styles.submitBtnText, Typography.title, { color: colors.onTint }]}>
            {isEditing ? '✓ Lưu thay đổi' : '🚀 Đăng tin ngay'}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },
  loadingCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageTitle: {
    fontWeight: '700',
  },
  sectionBox: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  sectionLabel: {
    marginBottom: Spacing.sm,
  },
  inputLabel: {
    marginBottom: Spacing.xs,
    fontWeight: '600',
  },
  previewWrapper: {
    marginBottom: Spacing.sm,
  },
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: BorderRadius.md,
  },
  compressionBanner: {
    marginTop: Spacing.xs,
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  photoActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  photoBtn: {
    flex: 1,
    minHeight: TouchTarget.minHeight,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm,
  },
  photoBtnText: {
    marginLeft: Spacing.xs,
    fontWeight: '600',
  },
  compressingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  textInput: {
    height: TouchTarget.minHeight,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
  },
  textArea: {
    minHeight: 80,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    textAlignVertical: 'top',
  },
  catScroll: {
    flexDirection: 'row',
    marginBottom: Spacing.xs,
  },
  catChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    marginRight: Spacing.sm,
  },
  catChipText: {},
  conditionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  conditionBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  priceStockRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  colHalf: {
    flex: 1,
  },
  errorText: {
    marginTop: Spacing.xxs,
  },
  submitBtn: {
    minHeight: TouchTarget.minHeight + 6,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  submitBtnText: {
    fontWeight: '700',
  },
});
