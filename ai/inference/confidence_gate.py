"""
GreenCoach AI - Confidence Gate Engine
Source of Truth: PRD, Architecture Rules, Decision Trees

Thresholds:
  confidence > 0.85        : HIGH CONFIDENCE (Definitive diagnosis + Eco-remedies)
  0.60 <= confidence <= 0.85: LIKELY (Request farmer visual confirmation / secondary check)
  confidence < 0.60        : LOW CONFIDENCE (Retake image / escalate to Extension Worker)
"""

from enum import Enum
from typing import Dict, Any, Optional

class ConfidenceTier(str, Enum):
    HIGH = "HIGH CONFIDENCE"
    LIKELY = "LIKELY"
    LOW = "LOW CONFIDENCE"

class ConfidenceGateResult:
    def __init__(
        self,
        confidence: float,
        tier: ConfidenceTier,
        action: str,
        requires_confirmation: bool,
        escalate_to_extension_worker: bool,
        user_message: str
    ):
        self.confidence = confidence
        self.tier = tier
        self.action = action
        self.requires_confirmation = requires_confirmation
        self.escalate_to_extension_worker = escalate_to_extension_worker
        self.user_message = user_message

    def to_dict(self) -> Dict[str, Any]:
        return {
            "confidence": self.confidence,
            "tier": self.tier.value,
            "action": self.action,
            "requires_confirmation": self.requires_confirmation,
            "escalate_to_extension_worker": self.escalate_to_extension_worker,
            "user_message": self.user_message
        }

class ConfidenceGate:
    HIGH_THRESHOLD = 0.85
    LIKELY_THRESHOLD = 0.60

    @classmethod
    def evaluate(cls, confidence: float) -> ConfidenceGateResult:
        """
        Evaluate confidence score with exact boundary semantics.
        Tested boundary values: 0.90, 0.85, 0.84, 0.60, 0.59, 0.20
        """
        # Boundary 1: confidence > 0.85
        if confidence > cls.HIGH_THRESHOLD:
            return ConfidenceGateResult(
                confidence=confidence,
                tier=ConfidenceTier.HIGH,
                action="PROCEED_ADVISORY",
                requires_confirmation=False,
                escalate_to_extension_worker=False,
                user_message="Diagnosis confirmed with high model certainty. Full advisory generated."
            )
        # Boundary 2: 0.60 <= confidence <= 0.85
        elif confidence >= cls.LIKELY_THRESHOLD:
            return ConfidenceGateResult(
                confidence=confidence,
                tier=ConfidenceTier.LIKELY,
                action="REQUEST_CONFIRMATION",
                requires_confirmation=True,
                escalate_to_extension_worker=False,
                user_message="Likely diagnosis detected. Compare with reference symptom guide."
            )
        # Boundary 3: confidence < 0.60
        else:
            return ConfidenceGateResult(
                confidence=confidence,
                tier=ConfidenceTier.LOW,
                action="RETAKE_OR_ESCALATE",
                requires_confirmation=False,
                escalate_to_extension_worker=True,
                user_message="Confidence below safety threshold. Please retake photo or submit for human review."
            )

if __name__ == "__main__":
    test_cases = [0.90, 0.85, 0.84, 0.60, 0.59, 0.20]
    print("GreenCoach AI Confidence Gate Self-Test:")
    for val in test_cases:
        res = ConfidenceGate.evaluate(val)
        print(f"Confidence {val:0.2f} -> Tier: {res.tier.value:16} | Action: {res.action}")
