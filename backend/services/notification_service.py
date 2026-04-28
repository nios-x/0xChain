from core.logger import logger

class NotificationService:
    def send_notification(self, recipient: str, message: str):
        logger.info(f"NOTIFICATION to {recipient}: {message}")
        # In a real app, integrate with Twilio, SendGrid, etc.

notification_service = NotificationService()
