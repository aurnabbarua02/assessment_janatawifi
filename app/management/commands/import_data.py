import json
import os
from django.core.management.base import BaseCommand, CommandError
from ...models import StockMarketModel
from django.conf import settings

class Command(BaseCommand):
    help = 'Import stock market data from a JSON file'

    def add_arguments(self, parser):
        parser.add_argument('json_file', type=str, help='The path to the JSON file to be imported')

    def handle(self, *args, **kwargs):
        json_file = kwargs['json_file']
        if not os.path.isabs(json_file):
            json_file = os.path.join(settings.BASE_DIR, json_file)

        if not os.path.exists(json_file):
            raise CommandError(f"File '{json_file}' does not exist")

        with open(json_file, 'r') as file:
            data = json.load(file)

        stock_data_instances = []
        for entry in data:
            try:
                stock_data = StockMarketModel(
                    date=entry['date'],
                    trade_code=entry['trade_code'],
                    high=entry['high'],
                    low=entry['low'],
                    open=entry['open'],
                    close=entry['close'],
                    volume=int(entry['volume'].replace(',', ''))
                )
                stock_data_instances.append(stock_data)
            except KeyError as e:
                self.stderr.write(f"Missing key {e} in entry: {entry}")
            except ValueError as e:
                self.stderr.write(f"Value error: {e} in entry: {entry}")

        StockMarketModel.objects.bulk_create(stock_data_instances)
        self.stdout.write(self.style.SUCCESS('Successfully imported stock market data'))
