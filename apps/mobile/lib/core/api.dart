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
              final response = await dio.post('/auth/refresh', data: {
                'refreshToken': refreshToken,
              });

              final newAccessToken = response.data['accessToken'];
              final newRefreshToken = response.data['refreshToken'];

              await _storage.asyncWriteTokens(
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
              );

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

  // ── Auth ──────────────────────────────────────────────────────────────

  Future<Map<String, dynamic>> loginEmail(String email, String password) async {
    final response = await dio.post('/auth/email/login', data: {
      'email': email,
      'password': password,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> registerEmail(String name, String email, String password) async {
    final response = await dio.post('/auth/email/register', data: {
      'name': name,
      'email': email,
      'password': password,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> googleAuth(String idToken, {String? email, String? name}) async {
    final response = await dio.post('/auth/google', data: {
      'idToken': idToken,
      if (email != null) 'email': email,
      if (name != null) 'name': name,
    });
    return response.data;
  }

  // ── Requests ──────────────────────────────────────────────────────────

  Future<List<dynamic>> getRequests() async {
    final response = await dio.get('/requests');
    return response.data;
  }

  Future<Map<String, dynamic>> getRequest(String id) async {
    final response = await dio.get('/requests/$id');
    return response.data;
  }

  Future<Map<String, dynamic>> createRequest(Map<String, dynamic> data) async {
    final response = await dio.post('/requests', data: data);
    return response.data;
  }

  // ── Users ─────────────────────────────────────────────────────────────

  Future<Map<String, dynamic>> getProfile() async {
    final response = await dio.get('/users/me');
    return response.data;
  }

  Future<Map<String, dynamic>> updateProfile(Map<String, dynamic> data) async {
    final response = await dio.patch('/users/me', data: data);
    return response.data;
  }
}
