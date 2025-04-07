from django.core.management.base import BaseCommand
from ecommerce.models import Color

class Command(BaseCommand):
    help = 'Add common colors to the database'

    def handle(self, *args, **kwargs):
        colors = [
            {'name': 'Đen', 'code': '#000000'},
            {'name': 'Trắng', 'code': '#FFFFFF'},
            {'name': 'Đỏ', 'code': '#FF0000'},
            {'name': 'Xanh Navy', 'code': '#000080'},
            {'name': 'Xanh Lá', 'code': '#008000'},
            {'name': 'Vàng', 'code': '#FFFF00'},
            {'name': 'Cam', 'code': '#FFA500'},
            {'name': 'Nâu', 'code': '#8B4513'},
            {'name': 'Xám', 'code': '#808080'},
            {'name': 'Hồng', 'code': '#FFC0CB'},
            {'name': 'Tím', 'code': '#800080'},
            {'name': 'Be', 'code': '#F5F5DC'},
        ]

        for color_data in colors:
            color, created = Color.objects.get_or_create(
                name=color_data['name'],
                defaults={'code': color_data['code']}
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Added color: {color.name}'))
            else:
                self.stdout.write(f'Color already exists: {color.name}') 