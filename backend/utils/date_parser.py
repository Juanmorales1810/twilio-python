import pendulum
import re
from datetime import datetime, timedelta
from typing import Optional, Tuple
from pendulum import DateTime

class DateParser:
    """Servicio para parsear fechas en lenguaje natural usando Pendulum"""
    
    def __init__(self, timezone: str = "America/Santiago"):
        """
        Inicializar el parser con zona horaria
        
        Args:
            timezone: Zona horaria por defecto (ej: "America/Santiago", "Europe/Madrid")
        """
        self.timezone = timezone
        pendulum.set_locale('es')  # Configurar idioma español
    
    def parse_natural_date(self, text: str, base_date: Optional[DateTime] = None) -> Tuple[Optional[DateTime], str]:
        """
        Parsear fecha desde texto natural en español
        
        Args:
            text: Texto que contiene la fecha (ej: "mañana a las 10:30", "el viernes próximo")
            base_date: Fecha base para cálculos relativos (por defecto: ahora)
            
        Returns:
            Tupla (fecha_parseada, explicación)
        """
        if base_date is None:
            base_date = pendulum.now(self.timezone)
        
        text = text.lower().strip()
        
        # Patrones de fecha y hora
        patterns = [
            # Fechas específicas con formato
            (r'(\d{1,2})[/\-](\d{1,2})[/\-](\d{4})\s+(?:a\s+las?\s+)?(\d{1,2}):(\d{2})', self._parse_specific_datetime),
            (r'(\d{4})[/\-](\d{1,2})[/\-](\d{1,2})\s+(\d{1,2}):(\d{2})', self._parse_iso_datetime),
            
            # Fechas relativas con hora (incluir formato sin minutos)
            (r'(mañana|tomorrow)\s+(?:a\s+las?\s+)?(\d{1,2}):(\d{2})', self._parse_tomorrow_with_time),
            (r'(mañana|tomorrow)\s+(?:a\s+las?\s+)?(\d{1,2})(?:\s*(?:h|hrs?|horas?))?$', self._parse_tomorrow_with_hour_only),
            (r'(pasado\s+mañana|day\s+after\s+tomorrow)\s+(?:a\s+las?\s+)?(\d{1,2}):(\d{2})', self._parse_day_after_tomorrow_with_time),
            (r'(pasado\s+mañana|day\s+after\s+tomorrow)\s+(?:a\s+las?\s+)?(\d{1,2})(?:\s*(?:h|hrs?|horas?))?$', self._parse_day_after_tomorrow_with_hour_only),
            (r'(hoy|today)\s+(?:a\s+las?\s+)?(\d{1,2}):(\d{2})', self._parse_today_with_time),
            (r'(hoy|today)\s+(?:a\s+las?\s+)?(\d{1,2})(?:\s*(?:h|hrs?|horas?))?$', self._parse_today_with_hour_only),
            
            # Días de la semana con hora (incluir formato sin minutos)
            (r'(el\s+)?(lunes|martes|mi[eé]rcoles|jueves|viernes|s[aá]bado|domingo)\s+(?:pr[oó]ximo\s+)?(?:a\s+las?\s+)?(\d{1,2}):(\d{2})', self._parse_weekday_with_time),
            (r'(el\s+)?(lunes|martes|mi[eé]rcoles|jueves|viernes|s[aá]bado|domingo)\s+(?:pr[oó]ximo\s+)?(?:a\s+las?\s+)?(\d{1,2})(?:\s*(?:h|hrs?|horas?))?$', self._parse_weekday_with_hour_only),
            
            # Solo fechas relativas (asume hora por defecto)
            (r'^(mañana|tomorrow)$', lambda m, bd: self._add_default_time(bd.add(days=1), 9, 0)),
            (r'^(pasado\s+mañana|day\s+after\s+tomorrow)$', lambda m, bd: self._add_default_time(bd.add(days=2), 9, 0)),
            (r'^(hoy|today)$', lambda m, bd: self._add_default_time(bd, 9, 0)),
            
            # Solo días de la semana (asume hora por defecto)
            (r'^(el\s+)?(lunes|martes|mi[eé]rcoles|jueves|viernes|s[aá]bado|domingo)(?:\s+pr[oó]ximo)?$', self._parse_weekday_only),
            
            # Horas específicas para hoy (incluir formato sin minutos)
            (r'(?:a\s+las?\s+)?(\d{1,2}):(\d{2})', self._parse_time_today),
            (r'(?:a\s+las?\s+)?(\d{1,2})\s+(?:de\s+la\s+)?(mañana|tarde|noche)', self._parse_time_period),
            (r'(?:a\s+las?\s+)?(\d{1,2})(?:\s*(?:h|hrs?|horas?))?$', self._parse_hour_only_today),
        ]
        
        for pattern, parser_func in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                try:
                    result_date = parser_func(match, base_date)
                    if result_date and result_date > base_date:
                        explanation = self._explain_parsed_date(result_date, base_date)
                        return result_date, explanation
                except Exception as e:
                    continue
        
        return None, f"No pude entender la fecha '{text}'. Prueba con: 'mañana a las 10:30', 'el viernes a las 14:00', o '27/09/2025 15:30'"
    
    def _parse_specific_datetime(self, match, base_date: DateTime) -> DateTime:
        """Parsear fecha específica DD/MM/YYYY HH:MM"""
        day, month, year, hour, minute = match.groups()
        return base_date.replace(
            year=int(year), 
            month=int(month), 
            day=int(day), 
            hour=int(hour), 
            minute=int(minute),
            second=0,
            microsecond=0
        )
    
    def _parse_iso_datetime(self, match, base_date: DateTime) -> DateTime:
        """Parsear fecha ISO YYYY-MM-DD HH:MM"""
        year, month, day, hour, minute = match.groups()
        return base_date.replace(
            year=int(year),
            month=int(month), 
            day=int(day),
            hour=int(hour),
            minute=int(minute),
            second=0,
            microsecond=0
        )
    
    def _parse_tomorrow_with_time(self, match, base_date: DateTime) -> DateTime:
        """Parsear mañana con hora específica"""
        _, hour, minute = match.groups()
        tomorrow = base_date.add(days=1)
        return tomorrow.replace(hour=int(hour), minute=int(minute), second=0, microsecond=0)
    
    def _parse_tomorrow_with_hour_only(self, match, base_date: DateTime) -> DateTime:
        """Parsear mañana con solo hora (sin minutos)"""
        _, hour = match.groups()
        tomorrow = base_date.add(days=1)
        return tomorrow.replace(hour=int(hour), minute=0, second=0, microsecond=0)
    
    def _parse_day_after_tomorrow_with_time(self, match, base_date: DateTime) -> DateTime:
        """Parsear pasado mañana con hora específica"""
        _, hour, minute = match.groups()
        day_after = base_date.add(days=2)
        return day_after.replace(hour=int(hour), minute=int(minute), second=0, microsecond=0)
    
    def _parse_day_after_tomorrow_with_hour_only(self, match, base_date: DateTime) -> DateTime:
        """Parsear pasado mañana con solo hora (sin minutos)"""
        _, hour = match.groups()
        day_after = base_date.add(days=2)
        return day_after.replace(hour=int(hour), minute=0, second=0, microsecond=0)
    
    def _parse_today_with_time(self, match, base_date: DateTime) -> DateTime:
        """Parsear hoy con hora específica"""
        _, hour, minute = match.groups()
        return base_date.replace(hour=int(hour), minute=int(minute), second=0, microsecond=0)
    
    def _parse_today_with_hour_only(self, match, base_date: DateTime) -> DateTime:
        """Parsear hoy con solo hora (sin minutos)"""
        _, hour = match.groups()
        return base_date.replace(hour=int(hour), minute=0, second=0, microsecond=0)
    
    def _parse_weekday_with_time(self, match, base_date: DateTime) -> DateTime:
        """Parsear día de la semana con hora"""
        groups = match.groups()
        weekday_name = groups[1]  # Segundo grupo es el día
        hour = int(groups[2])     # Tercer grupo es la hora
        minute = int(groups[3])   # Cuarto grupo son los minutos
        
        weekdays = {
            'lunes': 1, 'martes': 2, 'miércoles': 3, 'miercoles': 3,
            'jueves': 4, 'viernes': 5, 'sábado': 6, 'sabado': 6, 'domingo': 7
        }
        
        target_weekday = weekdays.get(weekday_name)
        if target_weekday is None:
            return None
        
        # Encontrar la próxima ocurrencia de ese día
        days_ahead = target_weekday - base_date.isoweekday()
        if days_ahead <= 0:  # Si es hoy o ya pasó esta semana
            days_ahead += 7
            
        target_date = base_date.add(days=days_ahead)
        return target_date.replace(hour=hour, minute=minute, second=0, microsecond=0)
    
    def _parse_weekday_with_hour_only(self, match, base_date: DateTime) -> DateTime:
        """Parsear día de la semana con solo hora (sin minutos)"""
        groups = match.groups()
        weekday_name = groups[1]  # Segundo grupo es el día
        hour = int(groups[2])     # Tercer grupo es la hora
        
        weekdays = {
            'lunes': 1, 'martes': 2, 'miércoles': 3, 'miercoles': 3,
            'jueves': 4, 'viernes': 5, 'sábado': 6, 'sabado': 6, 'domingo': 7
        }
        
        target_weekday = weekdays.get(weekday_name)
        if target_weekday is None:
            return None
        
        # Encontrar la próxima ocurrencia de ese día
        days_ahead = target_weekday - base_date.isoweekday()
        if days_ahead <= 0:  # Si es hoy o ya pasó esta semana
            days_ahead += 7
            
        target_date = base_date.add(days=days_ahead)
        return target_date.replace(hour=hour, minute=0, second=0, microsecond=0)
    
    def _parse_weekday_only(self, match, base_date: DateTime) -> DateTime:
        """Parsear solo día de la semana (hora por defecto 9:00)"""
        weekday_name = match.groups()[1]
        
        weekdays = {
            'lunes': 1, 'martes': 2, 'miércoles': 3, 'miercoles': 3,
            'jueves': 4, 'viernes': 5, 'sábado': 6, 'sabado': 6, 'domingo': 7
        }
        
        target_weekday = weekdays.get(weekday_name)
        if target_weekday is None:
            return None
        
        days_ahead = target_weekday - base_date.isoweekday()
        if days_ahead <= 0:
            days_ahead += 7
            
        target_date = base_date.add(days=days_ahead)
        return target_date.replace(hour=9, minute=0, second=0, microsecond=0)
    
    def _parse_time_today(self, match, base_date: DateTime) -> DateTime:
        """Parsear solo hora para hoy"""
        hour, minute = match.groups()
        return base_date.replace(hour=int(hour), minute=int(minute), second=0, microsecond=0)
    
    def _parse_hour_only_today(self, match, base_date: DateTime) -> DateTime:
        """Parsear solo hora para hoy (sin minutos)"""
        hour = match.groups()[0]
        return base_date.replace(hour=int(hour), minute=0, second=0, microsecond=0)
    
    def _parse_time_period(self, match, base_date: DateTime) -> DateTime:
        """Parsear hora con período del día"""
        hour_str, period = match.groups()
        hour = int(hour_str)
        
        # Ajustar hora según el período
        if period == 'mañana':
            if hour < 6:
                hour += 12  # Asumir PM si es muy temprano
        elif period == 'tarde':
            if hour < 12:
                hour += 12
        elif period == 'noche':
            if hour < 18:
                hour += 12
        
        return base_date.replace(hour=hour, minute=0, second=0, microsecond=0)
    
    def _add_default_time(self, date: DateTime, hour: int, minute: int) -> DateTime:
        """Agregar hora por defecto a una fecha"""
        return date.replace(hour=hour, minute=minute, second=0, microsecond=0)
    
    def _explain_parsed_date(self, parsed_date: DateTime, base_date: DateTime) -> str:
        """Generar explicación de la fecha parseada"""
        # Formato legible en español
        formatted_date = parsed_date.format('dddd, D [de] MMMM [de] YYYY [a las] HH:mm', locale='es')
        
        # Calcular diferencia en días
        days_diff = (parsed_date.date() - base_date.date()).days
        
        if days_diff == 0:
            time_desc = "Hoy"
        elif days_diff == 1:
            time_desc = "Mañana"
        elif days_diff == 2:
            time_desc = "Pasado mañana"
        else:
            time_desc = f"En {days_diff} días"
        
        return f"📅 {time_desc}: {formatted_date}"
    
    def format_date_for_display(self, date: DateTime) -> str:
        """Formatear fecha para mostrar al usuario"""
        return date.format('dddd, D [de] MMMM [de] YYYY [a las] HH:mm', locale='es')
    
    def is_business_hours(self, date: DateTime) -> bool:
        """Verificar si la fecha está en horario laboral"""
        weekday = date.isoweekday()  # 1=Lunes, 7=Domingo
        hour = date.hour
        
        # Lunes a Viernes, 8:00 a 18:00
        return 1 <= weekday <= 5 and 8 <= hour <= 18
    
    def suggest_business_hours_alternative(self, date: DateTime) -> DateTime:
        """Sugerir alternativa en horario laboral"""
        if self.is_business_hours(date):
            return date
        
        # Si es fin de semana, mover al lunes siguiente
        if date.isoweekday() > 5:
            days_to_monday = 8 - date.isoweekday()
            date = date.add(days=days_to_monday)
        
        # Si es fuera de horario, ajustar a 9:00 AM
        if date.hour < 8 or date.hour > 18:
            date = date.replace(hour=9, minute=0, second=0, microsecond=0)
        
        return date