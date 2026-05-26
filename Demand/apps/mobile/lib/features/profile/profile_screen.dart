import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme.dart';
import '../auth/auth_notifier.dart';

class ProfileScreen extends ConsumerStatefulWidget {
  const ProfileScreen({super.key});

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen> {
  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authNotifierProvider);
    final user = authState.user;

    // Swedish hobbyverksamhet mock metrics
    const double yearlyEarnings = 8400;
    const double taxLimit = 24300;
    final double percentUsed = (yearlyEarnings / taxLimit).clamp(0.0, 1.0);

    final roles = List<String>.from(user?['roles'] ?? ['REQUESTER']);

    void toggleRole(String role) {
      final updated = List<String>.from(roles);
      if (updated.contains(role)) {
        if (updated.length > 1) {
          updated.remove(role);
        }
      } else {
        updated.add(role);
      }
      ref.read(authNotifierProvider.notifier).updateUserRoles(updated);
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Account Profile'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.redAccent),
            onPressed: () => ref.read(authNotifierProvider.notifier).logout(),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Avatar & Name Card
            Card(
              color: AppColors.cardBg,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: const BorderSide(color: AppColors.border, width: 0.5),
              ),
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  children: [
                    CircleAvatar(
                      radius: 36,
                      backgroundColor: AppColors.darkBg,
                      child: Text(
                        user?['name']?[0] ?? 'U',
                        style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: AppColors.primary),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          user?['name'] ?? 'User Profile',
                          style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textLight),
                        ),
                        if (user?['bankidVerified'] == true)
                          const Padding(
                            padding: EdgeInsets.only(left: 6),
                            child: Icon(Icons.verified, color: AppColors.primary, size: 20),
                          ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      user?['email'] ?? 'Verified via Swedish BankID',
                      style: const TextStyle(color: AppColors.textMuted, fontSize: 12),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Swedish Hobbyverksamhet tracker card
            Card(
              color: AppColors.cardBg,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: const BorderSide(color: AppColors.border, width: 0.5),
              ),
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.gavel, color: AppColors.secondary, size: 18),
                        SizedBox(width: 8),
                        Text(
                          'Hobbyverksamhet Tax Tracker',
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppColors.textLight),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.between,
                      children: [
                        const Text('Yearly Earnings', style: TextStyle(color: AppColors.textMuted, fontSize: 12)),
                        Text('${yearlyEarnings.toStringAsFixed(0)} / ${taxLimit.toStringAsFixed(0)} SEK',
                            style: const TextStyle(color: AppColors.textLight, fontSize: 12, fontWeight: FontWeight.bold)),
                      ],
                    ),
                    const SizedBox(height: 8),
                    LinearProgressIndicator(
                      value: percentUsed,
                      backgroundColor: AppColors.darkBg,
                      color: AppColors.primary,
                      minHeight: 8,
                      borderRadius: BorderRadius.circular(4),
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'If earnings exceed Skatteverket\'s limits, declaration forms must be filled. We compile receipts automatically.',
                      style: TextStyle(color: AppColors.textMuted, fontSize: 10, height: 1.4),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Profile Roles Settings
            const Text('Account Configuration', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppColors.textMuted)),
            const SizedBox(height: 12),

            Row(
              children: [
                Expanded(
                  child: InkWell(
                    onTap: () => toggleRole('REQUESTER'),
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: roles.contains('REQUESTER') ? AppColors.primary.withOpacity(0.05) : AppColors.cardBg,
                        border: Border.all(color: roles.contains('REQUESTER') ? AppColors.primary : AppColors.border),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Requester', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppColors.textLight)),
                          SizedBox(height: 4),
                          Text('I want to post tasks.', style: TextStyle(color: AppColors.textMuted, fontSize: 11)),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: InkWell(
                    onTap: () => toggleRole('HELPER'),
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: roles.contains('HELPER') ? AppColors.primary.withOpacity(0.05) : AppColors.cardBg,
                        border: Border.all(color: roles.contains('HELPER') ? AppColors.primary : AppColors.border),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Helper', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppColors.textLight)),
                          SizedBox(height: 4),
                          Text('I want to complete tasks.', style: TextStyle(color: AppColors.textMuted, fontSize: 11)),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Identity Security info
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.cardBg,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.border),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.between,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Security Verification', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: AppColors.textLight)),
                      SizedBox(height: 2),
                      Text('Swedish Personnummer (GDPR protected)', style: TextStyle(color: AppColors.textMuted, fontSize: 10)),
                    ],
                  ),
                  Text('****-***1234', style: TextStyle(fontFamily: 'monospace', color: AppColors.textLight, fontSize: 12)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
