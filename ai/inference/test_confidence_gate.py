"""
Unit tests for GreenCoach AI Confidence Gate
Explicitly verifies boundary conditions specified in prompt:
0.90 -> HIGH CONFIDENCE
0.85 -> LIKELY (since 0.60 <= 0.85 <= 0.85)
0.84 -> LIKELY
0.60 -> LIKELY (since 0.60 <= 0.60 <= 0.85)
0.59 -> LOW CONFIDENCE (since 0.59 < 0.60)
0.20 -> LOW CONFIDENCE
"""

import unittest
from confidence_gate import ConfidenceGate, ConfidenceTier

class TestConfidenceGate(unittest.TestCase):

    def test_high_confidence_0_90(self):
        res = ConfidenceGate.evaluate(0.90)
        self.assertEqual(res.tier, ConfidenceTier.HIGH)
        self.assertFalse(res.requires_confirmation)
        self.assertFalse(res.escalate_to_extension_worker)
        self.assertEqual(res.action, "PROCEED_ADVISORY")

    def test_boundary_0_85_is_likely(self):
        # 0.85 is NOT > 0.85, so it falls into 0.60 <= confidence <= 0.85 (LIKELY)
        res = ConfidenceGate.evaluate(0.85)
        self.assertEqual(res.tier, ConfidenceTier.LIKELY)
        self.assertTrue(res.requires_confirmation)
        self.assertFalse(res.escalate_to_extension_worker)

    def test_likely_confidence_0_84(self):
        res = ConfidenceGate.evaluate(0.84)
        self.assertEqual(res.tier, ConfidenceTier.LIKELY)
        self.assertTrue(res.requires_confirmation)
        self.assertFalse(res.escalate_to_extension_worker)

    def test_boundary_0_60_is_likely(self):
        # 0.60 satisfies 0.60 <= confidence <= 0.85 (LIKELY)
        res = ConfidenceGate.evaluate(0.60)
        self.assertEqual(res.tier, ConfidenceTier.LIKELY)
        self.assertTrue(res.requires_confirmation)
        self.assertFalse(res.escalate_to_extension_worker)

    def test_boundary_0_59_is_low(self):
        # 0.59 is < 0.60, so LOW CONFIDENCE
        res = ConfidenceGate.evaluate(0.59)
        self.assertEqual(res.tier, ConfidenceTier.LOW)
        self.assertFalse(res.requires_confirmation)
        self.assertTrue(res.escalate_to_extension_worker)
        self.assertEqual(res.action, "RETAKE_OR_ESCALATE")

    def test_low_confidence_0_20(self):
        res = ConfidenceGate.evaluate(0.20)
        self.assertEqual(res.tier, ConfidenceTier.LOW)
        self.assertFalse(res.requires_confirmation)
        self.assertTrue(res.escalate_to_extension_worker)

if __name__ == "__main__":
    unittest.main()
