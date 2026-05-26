import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme.dart';
import 'auth_notifier.dart';

class AuthScreen extends ConsumerStatefulWidget {
  const AuthScreen({super.key});

  @override
  ConsumerState<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends ConsumerState<AuthScreen> {
  final _pinController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _isBankIdFlow = false;
  bool _isSimulatingAppLaunch = false;

  @override
  void dispose() {
    _pinController.dispose();
    super.dispose();
  }

  void _onBankIdSubmit() {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isSimulatingAppLaunch = true;
      });

      // Simulates opening BankID app ("bankid://") on user's device
      Future.delayed(const Duration(seconds: 2), () {
        if (!mounted) return;
        setState(() {
          _isSimulatingAppLaunch = false;
        });

        // Trigger notifier login logic
        ref.read(authNotifierProvider.notifier).loginWithMockBankId(
              _pinController.text,
              'Karl Eriksson',
            );
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authNotifierProvider);

    return Scaffold(
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Brand/Logo
              const Icon(
                Icons.shield_outlined,
                size: 80,
                color: AppColors.primary,
              ),
              const SizedBox(height: 16),
              const Text(
                'Demand',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 36,
                  fontWeight: FontWeight.extrabold,
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Sweden\'s Tasks Marketplace',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 14,
                  color: AppColors.textMuted,
                ),
              ),
              const SizedBox(height: 48),

              if (authState.isLoading || _isSimulatingAppLaunch)
                const Column(
                  children: [
                    CircularProgressIndicator(color: AppColors.primary),
                    SizedBox(height: 16),
                    Text(
                      'Opening BankID App...',
                      style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold),
                    ),
                    SizedBox(height: 8),
                    Text(
                      'Please verify the request using your security code.',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: AppColors.textMuted, fontSize: 12),
                    ),
                  ],
                )
              else if (_isBankIdFlow)
                Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      const Text(
                        'Swedish Personal Number',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textMuted,
                        ),
                      ),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: _pinController,
                        keyboardType: TextInputType.number,
                        maxLength: 12,
                        decoration: const InputDecoration(
                          hintText: 'YYYYMMDDXXXX',
                          counterText: '',
                        ),
                        validator: (value) {
                          if (value == null || value.length != 12) {
                            return 'Please enter 12 digits (YYYYMMDDXXXX)';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: _onBankIdSubmit,
                        child: const Text('Log In with BankID'),
                      ),
                      const SizedBox(height: 16),
                      TextButton(
                        onPressed: () => setState(() => _isBankIdFlow = false),
                        child: const Text(
                          'Cancel',
                          style: TextStyle(color: AppColors.textMuted),
                        ),
                      ),
                    ],
                  ),
                )
              else
                Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    ElevatedButton.icon(
                      onPressed: () => setState(() => _isBankIdFlow = true),
                      icon: const Icon(Icons.security, color: Colors.black),
                      label: const Text('Continue with BankID'),
                    ),
                    const SizedBox(height: 16),
                    OutlinedButton.icon(
                      onPressed: () => ref
                          .read(authNotifierProvider.notifier)
                          .loginWithMockGoogle(),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        side: const BorderSide(color: AppColors.border),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      icon: Image.network(
                        'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/24px-Google_%22G%22_logo.svg.png',
                        height: 20,
                      ),
                      label: const Text(
                        'Continue with Google',
                        style: TextStyle(color: AppColors.textLight, fontSize: 16),
                      ),
                    ),
                    const SizedBox(height: 24),
                    const Text(
                      'By logging in, you agree to Skatteverket reporting and Swedish marketplace compliance policies.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 11,
                        color: AppColors.textMuted,
                      ),
                    ),
                  ],
                ),
            ],
          ),
        ),
      ),
    );
  }
}
