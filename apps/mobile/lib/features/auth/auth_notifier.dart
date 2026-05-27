import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/storage.dart';

class AuthState {
  final Map<String, dynamic>? user;
  final bool isAuthenticated;
  final bool isLoading;
  final String? error;

  AuthState({
    this.user,
    this.isAuthenticated = false,
    this.isLoading = false,
    this.error,
  });

  AuthState copyWith({
    Map<String, dynamic>? user,
    bool? isAuthenticated,
    bool? isLoading,
    String? error,
  }) {
    return AuthState(
      user: user ?? this.user,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  final SecureStorageService _storage;

  AuthNotifier(this._storage) : super(AuthState()) {
    _loadSession();
  }

  Future<void> _loadSession() async {
    final user = await _storage.getUser();
    final token = await _storage.getAccessToken();
    if (user != null && token != null) {
      state = AuthState(user: user, isAuthenticated: true);
    }
  }

  Future<void> loginWithMockBankId(String personnummer, String name) async {
    state = state.copyWith(isLoading: true, error: null);
    
    // Simulate API delay
    await Future.delayed(const Duration(seconds: 2));

    final mockUser = {
      'id': 'b1',
      'name': name,
      'personnummer': personnummer,
      'roles': ['REQUESTER'],
      'bankidVerified': true,
    };

    await _storage.asyncWriteTokens(
      accessToken: 'mock-bankid-access-token',
      refreshToken: 'mock-bankid-refresh-token',
    );
    await _storage.asyncWriteUser(mockUser);

    state = AuthState(user: mockUser, isAuthenticated: true);
  }

  Future<void> loginWithMockGoogle() async {
    state = state.copyWith(isLoading: true, error: null);
    
    await Future.delayed(const Duration(seconds: 1));

    final mockUser = {
      'id': 'g1',
      'name': 'Saga Lindgren',
      'email': 'saga.lindgren@gmail.com',
      'roles': ['REQUESTER'],
      'bankidVerified': false,
    };

    await _storage.asyncWriteTokens(
      accessToken: 'mock-google-access-token',
      refreshToken: 'mock-google-refresh-token',
    );
    await _storage.asyncWriteUser(mockUser);

    state = AuthState(user: mockUser, isAuthenticated: true);
  }

  Future<void> updateUserRoles(List<String> roles) async {
    if (state.user == null) return;
    
    final updatedUser = Map<String, dynamic>.from(state.user!);
    updatedUser['roles'] = roles;
    
    await _storage.asyncWriteUser(updatedUser);
    state = state.copyWith(user: updatedUser);
  }

  Future<void> logout() async {
    await _storage.clearAuthData();
    state = AuthState();
  }
}

final authNotifierProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final storage = ref.read(secureStorageProvider);
  return AuthNotifier(storage);
});
