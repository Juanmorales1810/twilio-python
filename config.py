import os
from typing import Optional

class Config:
    # Twilio Configuration
    TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
    TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
    TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")
    
    # Database Configuration
    MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DATABASE_NAME = os.getenv("DATABASE_NAME", "toyota_sanjuan")
    
    # AI Model Configuration
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-pro")
    
    # Security
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
    
    # Conversation Settings
    USER_SESSION_EXPIRY_HOURS = int(os.getenv("USER_SESSION_EXPIRY_HOURS", "24"))
    MESSAGE_HISTORY_EXPIRY_HOURS = int(os.getenv("MESSAGE_HISTORY_EXPIRY_HOURS", "168"))  # 1 semana
    
    # Business Hours
    BUSINESS_START_HOUR = int(os.getenv("BUSINESS_START_HOUR", "9"))
    BUSINESS_END_HOUR = int(os.getenv("BUSINESS_END_HOUR", "18"))
    BUSINESS_START_HOUR_SAT = int(os.getenv("BUSINESS_START_HOUR_SAT", "9"))
    BUSINESS_END_HOUR_SAT = int(os.getenv("BUSINESS_END_HOUR_SAT", "14"))
    
    # Contact Information
    AGENCY_PHONE = os.getenv("AGENCY_PHONE", "(787) 555-0123")
    AGENCY_EMAIL = os.getenv("AGENCY_EMAIL", "contacto@toyota-sanjuan.com")
    AGENCY_ADDRESS = os.getenv("AGENCY_ADDRESS", "Av. Roosevelt 1234, San Juan, Puerto Rico")
    
    @classmethod
    def validate_config(cls) -> bool:
        """Valida que todas las configuraciones requeridas estén presentes"""
        required_vars = [
            "TWILIO_ACCOUNT_SID",
            "TWILIO_AUTH_TOKEN", 
            "TWILIO_PHONE_NUMBER",
            "GEMINI_API_KEY"
        ]
        
        missing_vars = []
        for var in required_vars:
            if not getattr(cls, var):
                missing_vars.append(var)
        
        if missing_vars:
            print(f"❌ Variables de entorno faltantes: {', '.join(missing_vars)}")
            return False
        
        print("✅ Configuración validada correctamente")
        return True