import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'storage.dart';

final apiProvider = Provider<ApiService>((ref) {
  final storage = ref.read(secureStorageProvider);
  return ApiService(storage);
});

class ApiService {
  final SecureStorageService _storage;
  late final Dio dio;

  // Swap to your local machines IP address when running on physical devices
  static const String baseUrl = 'http://localhost:4000';

  ApiService(this._storage) {
    dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: {
        'Content-Type': 'application/json',
      },
    ));

    dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _storage.getAccessToken();
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (error, handler) async {
        if (error.response?.statusCode == 401) {
          final refreshToken = await _storage.getRefreshToken();
          if (refreshToken != null) {
            try {
              // Attempt to refresh token
              final response = await dio.post('/auth/refresh', data: {
                'refreshToken': refreshToken,
              });

              final newAccessToken = response.data['accessToken'];
              final newRefreshToken = response.data['refreshToken'];

              await _storage.asyncWriteTokens(
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
              );

              // Retry original request
              final options = error.requestOptions;
              options.headers['Authorization'] = 'Bearer $newAccessToken';
              
              final clonedRequest = await dio.request(
                options.path,
                options: Options(
                  method: options.method,
                  headers: options.headers,
                ),
                data: options.data,
                queryParameters: options.queryParameters,
              );

              return handler.resolve(clonedRequest);
            } catch (e) {
              await _storage.clearAuthData();
            }
          }
        }
        return handler.next(error);
      },
    ));
  }
}
