#!/usr/bin/env python3
"""
Test simple para el problema de validación de horas
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.validators import validate_time

def test_time_validation_simple():
    """Prueba solo la validación de horas sin IA"""
    
    print("=== PRUEBA SIMPLE DE VALIDACIÓN DE HORAS ===\n")
    
    test_cases = [
        ("18:00", "✅ Debería ser válido (6 PM)"),
        ("6:00 PM", "✅ Debería ser válido (6 PM)"), 
        ("6 PM", "✅ Debería ser válido (6 PM)"),
        ("18", "✅ Debería ser válido (6 PM)"),
        ("14:30", "✅ Debería ser válido (2:30 PM)"),
        ("2:30 PM", "✅ Debería ser válido (2:30 PM)"),
        ("9:00", "✅ Debería ser válido (9 AM)"),
        ("6:00", "✅ Debería ser válido (6 PM interpretado)"),
        ("19:00", "❌ Debería ser inválido (fuera de horario)"),
        ("8:00", "❌ Debería ser inválido (fuera de horario)"),
        ("abc", "❌ Debería ser inválido (no es hora)"),
        ("25:00", "❌ Debería ser inválido (hora imposible)")
    ]
    
    print("Horario de atención: 9:00 AM - 6:00 PM (18:00)\n")
    
    for time_str, expected in test_cases:
        result = validate_time(time_str)
        status = "✅" if result else "❌"
        print(f"{status} '{time_str}' → {result} | {expected}")
        
    print("\n" + "="*60)
    
    # Test específico para el caso reportado
    print("\n🎯 CASO ESPECÍFICO DEL BUG:")
    print("Usuario dice: 'Si esa fecha está bien y quiero que sea a las 6 pm'")
    print("Usuario dice: '18:00'")
    
    result_6pm = validate_time("6 PM")
    result_1800 = validate_time("18:00")
    
    print(f"'6 PM' → {result_6pm}")
    print(f"'18:00' → {result_1800}")
    
    if result_6pm and result_1800:
        print("✅ Ambos formatos son válidos - CORRECTO")
    else:
        print("❌ Algún formato no es válido - PROBLEMA")

def test_edge_cases():
    """Prueba casos límite"""
    
    print("\n=== CASOS LÍMITE ===\n")
    
    edge_cases = [
        "9:00",    # Hora de apertura
        "18:00",   # Hora de cierre
        "8:59",    # Un minuto antes de abrir
        "18:01",   # Un minuto después de cerrar
        "12:00",   # Mediodía
        "6",       # Solo número
        "6pm",     # Sin espacio
        "6 p.m.",  # Con puntos
    ]
    
    for case in edge_cases:
        result = validate_time(case)
        status = "✅" if result else "❌"
        print(f"{status} '{case}' → {result}")

if __name__ == "__main__":
    test_time_validation_simple()
    test_edge_cases()
